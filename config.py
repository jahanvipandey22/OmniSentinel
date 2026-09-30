"""
OmniSentinel: Global Configuration
Engineered for Snapdragon-powered HP PCs (HP OmniBook Ultra / OmniBook X)
Leveraging Qualcomm Hexagon NPU (45 TOPS) & Qualcomm AI Hub
"""

import os
from pathlib import Path
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent

class HardwareConfig(BaseModel):
    target_device: str = "Snapdragon X Elite / Snapdragon X Plus (HP OmniBook)"
    npu_name: str = "Qualcomm Hexagon NPU"
    npu_tops: float = 45.0
    
    # Execution Provider priority for ONNX Runtime
    # On Snapdragon Windows ARM: QNNExecutionProvider maps directly to Hexagon HTP
    execution_providers: list[str] = Field(
        default_factory=lambda: [
            "QNNExecutionProvider",
            "DmlExecutionProvider",  # DirectML fallback on Adreno / Windows GPU
            "CPUExecutionProvider"   # Universal fallback
        ]
    )
    
    # QNN HTP (Hexagon Tensor Processor) specific backend options
    qnn_options: dict = Field(
        default_factory=lambda: {
            "backend_path": "QnnHtp.dll",
            "htp_performance_mode": "burst",      # burst | sustained_high_performance | high_performance
            "enable_fp16_relaxed_precision": "1",
            "profiling_level": "basic"
        }
    )
    
    # Comparative Power Baselines (Watts) for Real-Time Telemetry
    power_profiles_watts: dict = Field(
        default_factory=lambda: {
            "snapdragon_hexagon_npu": 2.8,    # Ultra-low thermal envelope on HP OmniBook
            "x86_integrated_gpu": 24.5,       # Intel / AMD iGPU under multi-model load
            "discrete_mobile_gpu": 65.0,      # Discrete mobile GPU (RTX series)
            "cloud_api_call_roundtrip_ms": 480.0
        }
    )

class GlanceGuardConfig(BaseModel):
    """Vision & Shoulder-Surfing Privacy Configuration"""
    enabled: bool = True
    camera_index: int = 0
    frame_width: int = 640
    frame_height: int = 480
    fps_target: int = 20
    
    # Detection thresholds
    primary_user_distance_ratio: float = 0.25 # Face area ratio to frame
    bystander_threshold: int = 2              # 2 or more faces = shoulder surfing alert
    gaze_deviation_degrees: float = 35.0     # Looking away detection
    privacy_blur_intensity: int = 45          # Gaussian blur strength for frosted shield
    auto_shield_delay_frames: int = 3        # Debounce trigger to avoid false flickers

class MeetingBrainConfig(BaseModel):
    """Real-Time Meeting Intelligence Configuration"""
    enabled: bool = True
    audio_sample_rate: int = 16000
    chunk_duration_seconds: float = 3.0
    model_name: str = "whisper-base-qnn"
    slm_model_name: str = "llama-3.2-1b-instruct-qnn"
    max_context_tokens: int = 2048
    temperature: float = 0.3

class Config(BaseModel):
    app_name: str = "OmniSentinel"
    version: str = "1.0.0"
    author: str = "Qualcomm AI Lab Build & Present Challenge"
    hardware: HardwareConfig = Field(default_factory=HardwareConfig)
    vision: GlanceGuardConfig = Field(default_factory=GlanceGuardConfig)
    meeting: MeetingBrainConfig = Field(default_factory=MeetingBrainConfig)
    host: str = "0.0.0.0"
    port: int = 8080

config = Config()
