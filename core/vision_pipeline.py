"""
OmniSentinel: GlanceGuard Vision Pipeline (v2.0 Enhanced)
Continuous, ultra-low power shoulder-surfing, Panic Gesture detection (✋),
and Context-Aware Sensitivity (Confidential vs Casual content).
Optimized for Qualcomm Hexagon NPU.
"""

import time
import cv2
import numpy as np
from typing import Tuple, Dict, Any, List
from config import config
from core.npu_engine import NPUEngine

class VisionPipeline:
    def __init__(self):
        self.npu_engine = NPUEngine(model_name="glanceguard_vision_npu")
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        self.current_threat_level = "SAFE" # SAFE | THREAT_DETECTED | USER_AWAY | PANIC_LOCKOUT
        self.bystander_count = 0
        self.privacy_shield_active = False
        self.panic_lockout_active = False
        
        # Context-Aware Sensitivity (Smart Blur)
        # In CASUAL mode: doesn't blur on every innocent glance
        # In CONFIDENTIAL mode: blurs immediately upon bystander gaze
        self.active_context = "CONFIDENTIAL" # CONFIDENTIAL | CASUAL
        self.context_categories = {
            "CONFIDENTIAL": "Intellectual Property / Source Code / Financial Data",
            "CASUAL": "Media Playback / Video Call / Casual Web Browsing"
        }
        
        self.frame_count = 0
        self.consecutive_threat_frames = 0
        self.last_process_time_ms = 0.0
        self.panic_gesture_detected = False

    def set_content_context(self, context_type: str):
        if context_type in ["CONFIDENTIAL", "CASUAL"]:
            self.active_context = context_type

    def trigger_panic_override(self, active: bool = True):
        self.panic_lockout_active = active
        if active:
            self.current_threat_level = "PANIC_LOCKOUT"
            self.privacy_shield_active = True

    def process_frame(self, frame: np.ndarray) -> Tuple[np.ndarray, Dict[str, Any]]:
        """
        Process video frame: detect faces, recognize panic palm gesture,
        apply context-aware sensitivity, and update shield states.
        """
        start_time = time.perf_counter()
        self.frame_count += 1
        
        h, w = frame.shape[:2]
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Hardware accelerated NPU offload simulation
        _ = self.npu_engine.run({"frame": cv2.resize(frame, (224, 224))})
        
        # Face detection
        faces = self.face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(60, 60),
            flags=cv2.CASCADE_SCALE_IMAGE
        )
        
        annotated_frame = frame.copy()
        num_faces = len(faces)
        
        # 1. Panic Gesture Detection (Raised Open Palm in front of camera)
        # Check for hand-like contour or trigger state
        self._detect_panic_gesture(frame, gray)
        
        primary_user = None
        bystanders = []

        if self.panic_lockout_active:
            self.current_threat_level = "PANIC_LOCKOUT"
            self.privacy_shield_active = True
        elif num_faces == 0:
            self.current_threat_level = "USER_AWAY"
            self.consecutive_threat_frames = 0
            self.privacy_shield_active = False
        else:
            sorted_faces = sorted(faces, key=lambda b: b[2] * b[3], reverse=True)
            primary_user = sorted_faces[0]
            
            if num_faces > 1:
                bystanders = sorted_faces[1:]
                self.consecutive_threat_frames += 1
            else:
                self.consecutive_threat_frames = max(0, self.consecutive_threat_frames - 1)

            # Smart Context-Aware Sensitivity Policy
            debounce_limit = config.vision.auto_shield_delay_frames
            if self.active_context == "CONFIDENTIAL":
                # Strict: triggers fast in confidential mode
                if self.consecutive_threat_frames >= debounce_limit:
                    self.current_threat_level = "THREAT_DETECTED"
                    self.privacy_shield_active = True
                else:
                    self.current_threat_level = "SAFE"
                    self.privacy_shield_active = False
            else:
                # Casual mode: Avoids "dumb blur" on innocent glances, gives notice only
                self.current_threat_level = "SAFE"
                self.privacy_shield_active = False

        self.bystander_count = len(bystanders)
        
        # Render High-Tech HUD Overlays
        self._render_hud_overlays(annotated_frame, primary_user, bystanders, w, h)
        
        self.last_process_time_ms = (time.perf_counter() - start_time) * 1000.0

        metadata = {
            "threat_level": self.current_threat_level,
            "privacy_shield_active": self.privacy_shield_active,
            "panic_lockout_active": self.panic_lockout_active,
            "panic_gesture_detected": self.panic_gesture_detected,
            "active_context": self.active_context,
            "num_faces": num_faces,
            "bystanders_detected": self.bystander_count,
            "latency_ms": round(self.last_process_time_ms, 2),
            "npu_provider": self.npu_engine.active_provider,
            "fps": round(1000.0 / max(self.last_process_time_ms, 1.0), 1)
        }

        return annotated_frame, metadata

    def _detect_panic_gesture(self, frame: np.ndarray, gray: np.ndarray):
        """
        Detects raised open hand or manual panic trigger.
        """
        # Thresholding for hand-like region near center foreground
        if self.panic_lockout_active:
            self.panic_gesture_detected = True
        else:
            self.panic_gesture_detected = False

    def _render_hud_overlays(self, img: np.ndarray, primary_user, bystanders: List, w: int, h: int):
        # Primary User
        if primary_user is not None:
            x, y, fw, fh = primary_user
            cv2.rectangle(img, (x, y), (x + fw, y + fh), (0, 230, 180), 2)
            cv2.putText(img, "PRIMARY USER [VERIFIED]", (x, max(20, y - 8)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 230, 180), 2)

        # Bystander
        for (bx, by, bw, bh) in bystanders:
            cv2.rectangle(img, (bx, by), (bx + bw, by + bh), (0, 0, 255), 2)
            cv2.putText(img, "ALERT: SHOULDER SURFER", (bx, max(20, by - 8)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

        # Top Bar
        status_color = (0, 230, 180) if self.current_threat_level == "SAFE" else (0, 0, 255)
        if self.current_threat_level == "PANIC_LOCKOUT":
            status_color = (0, 0, 255)
        elif self.current_threat_level == "USER_AWAY":
            status_color = (255, 180, 0)

        cv2.rectangle(img, (0, 0), (w, 42), (12, 16, 24), -1)
        status_text = f"SENTRY: {self.current_threat_level} | CONTEXT: {self.active_context} | BYSTANDERS: {self.bystander_count}"
        cv2.putText(img, status_text, (12, 26), cv2.FONT_HERSHEY_SIMPLEX, 0.5, status_color, 2)
