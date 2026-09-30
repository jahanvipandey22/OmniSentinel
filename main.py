"""
OmniSentinel: Main Entrypoint
Launches the OmniSentinel Edge AI Engine and HP OmniBook UI.
"""

import sys
import uvicorn
import logging
from config import config

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s] %(message)s"
)
logger = logging.getLogger("OmniSentinel")

def main():
    print("=" * 70)
    print("  OMNISENTINEL: ZERO-CLOUD AMBIENT PRIVACY & MEETING INTELLIGENCE")
    print("  Engineered for Snapdragon-Powered HP PCs (OmniBook Ultra & X)")
    print("  Powered by Qualcomm Hexagon NPU (45 TOPS) & Qualcomm AI Hub")
    print("=" * 70)
    print(f"  Target Device : {config.hardware.target_device}")
    print(f"  Execution Mode: 100% On-Device / Air-Gapped (Zero Cloud Egress)")
    print(f"  Web Dashboard : http://{config.host}:{config.port}")
    print("=" * 70)

    uvicorn.run(
        "ui.server:app",
        host=config.host,
        port=config.port,
        log_level="info",
        reload=False
    )

if __name__ == "__main__":
    main()
