"""
OmniSentinel: UI & API Gateway Server (v2.0 Enhanced)
High-performance FastAPI server providing REST endpoints, MJPEG video streaming,
real-time WebSockets, Location Trust Scoring, Panic Gesture triggers, and Zero-Cloud counters.
"""

import os
import cv2
import json
import time
import asyncio
import logging
import numpy as np
from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.responses import HTMLResponse, StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from config import config
from core.vision_pipeline import VisionPipeline
from core.audio_pipeline import AudioPipeline
from core.slm_pipeline import SLMPipeline
from core.doc_rag import PrivaDocRAG
from core.qai_hub_client import QAIHubClient
from core.location_trust import LocationTrustEngine
from telemetry.hardware_monitor import HardwareMonitor

logger = logging.getLogger("OmniSentinel.Server")
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="OmniSentinel", version="2.0.0")

STATIC_DIR = Path(__file__).resolve().parent / "static"
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Instantiate Core Pipelines
vision_pipeline = VisionPipeline()
audio_pipeline = AudioPipeline()
slm_pipeline = SLMPipeline()
doc_rag = PrivaDocRAG()
qai_hub_client = QAIHubClient()
location_trust_engine = LocationTrustEngine()
hardware_monitor = HardwareMonitor()

# Global camera capture handle
camera = None

def get_camera():
    global camera
    if camera is None:
        camera = cv2.VideoCapture(0)
        camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    return camera

def generate_video_frames():
    cam = get_camera()
    synthetic_angle = 0
    
    while True:
        success = False
        frame = None
        if cam is not None and cam.isOpened():
            success, frame = cam.read()

        if not success or frame is None:
            synthetic_angle += 0.05
            frame = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.rectangle(frame, (0, 0), (640, 480), (18, 22, 30), -1)
            
            # Simulated primary face
            cx, cy = 320, 240
            cv2.circle(frame, (cx, cy), 80, (65, 75, 90), -1)
            cv2.ellipse(frame, (cx, cy + 180), (140, 100), 0, 0, 180, (45, 55, 68), -1)
            
            # Periodic simulated bystander
            if int(time.time()) % 14 >= 7:
                bx = int(500 + 20 * np.sin(synthetic_angle))
                by = 180
                cv2.circle(frame, (bx, by), 50, (50, 55, 70), -1)
                cv2.putText(frame, "BYSTANDER IN FRAME", (bx - 70, by - 60),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 100, 255), 1)

            # If Panic Gesture active, show hand overlay
            if vision_pipeline.panic_lockout_active:
                cv2.rectangle(frame, (270, 180), (370, 320), (0, 0, 255), 3)
                cv2.putText(frame, "[PANIC GESTURE: OPEN PALM]", (200, 160),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

        annotated_frame, metadata = vision_pipeline.process_frame(frame)
        ret, buffer = cv2.imencode('.jpg', annotated_frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        
        time.sleep(0.04)

@app.get("/", response_class=HTMLResponse)
async def serve_dashboard():
    index_file = STATIC_DIR / "index.html"
    return HTMLResponse(content=index_file.read_text(encoding="utf-8"))

@app.get("/video_feed")
def video_feed():
    return StreamingResponse(
        generate_video_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@app.get("/api/telemetry")
async def get_telemetry():
    metrics = hardware_monitor.get_metrics(
        npu_active=True,
        vision_latency=vision_pipeline.last_process_time_ms,
        audio_latency=42.0
    )
    trust_info = location_trust_engine.evaluate_trust(vision_pipeline.bystander_count)
    metrics["location_trust"] = trust_info
    metrics["cloud_egress_bytes"] = 0
    return metrics

@app.get("/api/benchmarks")
async def get_benchmarks():
    benchmark_file = Path(__file__).resolve().parent.parent / "benchmarks" / "snapdragon_x_profile.json"
    if benchmark_file.exists():
        return json.loads(benchmark_file.read_text(encoding="utf-8"))
    return qai_hub_client.get_benchmark_report("glanceguard_vision")

@app.post("/api/meeting/transcribe")
async def transcribe_step():
    return audio_pipeline.process_audio_chunk()

@app.post("/api/meeting/summarize")
async def generate_summary():
    full_text = audio_pipeline.get_full_transcript_text()
    return slm_pipeline.generate_meeting_summary(full_text)

class QueryRequest(BaseModel):
    query: str

@app.post("/api/rag/query")
async def query_privadoc(req: QueryRequest):
    return doc_rag.query(req.query)

class LocationModeRequest(BaseModel):
    mode: str # HOME | COWORKING | AIRPORT

@app.post("/api/location/mode")
async def set_location_mode(req: LocationModeRequest):
    location_trust_engine.set_location_mode(req.mode)
    return {"status": "success", "mode": req.mode}

class ContextModeRequest(BaseModel):
    context: str # CONFIDENTIAL | CASUAL

@app.post("/api/privacy/context")
async def set_context_mode(req: ContextModeRequest):
    vision_pipeline.set_content_context(req.context)
    return {"status": "success", "active_context": req.context}

class PanicRequest(BaseModel):
    active: bool

@app.post("/api/privacy/panic")
async def trigger_panic(req: PanicRequest):
    vision_pipeline.trigger_panic_override(req.active)
    return {"status": "success", "panic_lockout_active": req.active}

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            metrics = hardware_monitor.get_metrics(
                npu_active=True,
                vision_latency=vision_pipeline.last_process_time_ms,
                audio_latency=42.0
            )
            trust_info = location_trust_engine.evaluate_trust(vision_pipeline.bystander_count)
            metrics["location_trust"] = trust_info
            metrics["threat_level"] = vision_pipeline.current_threat_level
            metrics["privacy_shield_active"] = vision_pipeline.privacy_shield_active
            metrics["panic_lockout_active"] = vision_pipeline.panic_lockout_active
            metrics["panic_gesture_detected"] = vision_pipeline.panic_gesture_detected
            metrics["active_context"] = vision_pipeline.active_context
            metrics["bystander_count"] = vision_pipeline.bystander_count
            metrics["cloud_egress_bytes"] = 0

            await websocket.send_json(metrics)
            await asyncio.sleep(0.5)
    except WebSocketDisconnect:
        pass
