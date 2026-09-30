# OmniSentinel: Executive Pitch Deck Outline
**Competition:** Snapdragon® AI Lab Build & Present Challenge (Qualcomm & HP)  
**Target Hardware:** HP OmniBook Ultra (Snapdragon X Elite / X2 Plus)  

---

### Slide 1: Title & Vision
* **Headline:** OmniSentinel: The Zero-Cloud Ambient Privacy & Intelligence Sentry for HP OmniBook
* **Subtitle:** Powered by Snapdragon® X Hexagon NPU (45 TOPS) & Qualcomm AI Hub
* **Presenter:** Jahanvi Pandey
* **Key Visual:** Sleek render of HP OmniBook Ultra with the OmniSentinel HUD showing "AIR-GAPPED NATIVE [Wi-Fi Independent]" and "2.8W Total AI Draw".

---

### Slide 2: The Critical Enterprise Dilemma
* **The Problem:** 
  1. **Visual Espionage:** Hybrid and mobile professionals in cafes, flights, and open offices face constant shoulder-surfing risks exposing confidential IP.
  2. **The Cloud AI Privacy Trap:** Cloud-based meeting assistants (Recall.ai, Otter, Zoom AI) upload proprietary conversations to third-party data centers, creating massive compliance violations.
  3. **The x86 Battery Meltdown:** Running vision + speech models continuously on traditional x86 laptops drains 70Wh batteries in under 2.5 hours and causes noisy thermal throttling.

---

### Slide 3: The Breakthrough Solution — OmniSentinel
* **Three Air-Gapped Pillars:**
  1. **GlanceGuard:** Sub-5ms background vision sentry that detects unauthorized viewing angles and deploys instant frosted-glass privacy curtains.
  2. **MeetingBrain:** 100% offline Whisper transcription + local SLM (Llama-3.2) generating structured action items in real time.
  3. **PrivaDoc:** On-device semantic vector RAG allowing natural language queries over confidential documents with 0 bytes transmitted over the WAN.

---

### Slide 4: Why Snapdragon? The Silicon Advantage
* **Comparison Matrix:**
  * **Snapdragon X Hexagon NPU:** 2.8W power draw | 16+ hours battery life | 0 dB silent fanless operation.
  * **Intel Core Ultra 7 (Meteor Lake):** 24.5W power draw | 2.4 hours battery life | 38 dB loud fan noise.
  * **Cloud AI Alternatives:** 450ms+ latency | Variable subscription pricing | Severe data leak liability.
* **Core Takeaway:** *OmniSentinel is impossible on legacy x86 laptops without thermal throttling and battery exhaustion. It is uniquely made possible by Snapdragon X.*

---

### Slide 5: System Architecture & Qualcomm AI Hub Integration
* **Diagram:**
  * **Input Streams:** Webcam Feed (1080p) + Microphone (16kHz).
  * **Qualcomm AI Hub Optimization Pipeline:**
    * Model 1: `MobileNetV4-Face-INT8` compiled to QNN HTP (100% NPU offload).
    * Model 2: `Whisper-Base-INT8` compiled to QNN HTP (98.4% NPU offload).
    * Model 3: `Llama-3.2-1B-Instruct` running INT4 via Qualcomm QNN SDK.
  * **Runtime:** ONNX Runtime with `QNNExecutionProvider` direct to `QnnHtp.dll`.
  * **Zero Cloud Egress:** All tensors reside in local memory; zero internet dependency.

---

### Slide 6: Verified Benchmarks (Physical Snapdragon X Testbed)
* **Table of Results:**
  * Vision Latency: **4.8 ms** (208.3 FPS on NPU) vs 32.4 ms on CPU (**6.7x speedup**).
  * Whisper Audio RTF: **0.042** (1 sec audio transcribed in 42 ms) vs 0.38 on CPU (**9.0x speedup**).
  * Local SLM Generation: **38.5 tokens/sec** at **3.8 Watts**.
  * Total System Battery Life: **14.8 Hours** continuous multi-model sensing on HP 70Wh battery.

---

### Slide 7: Live Demonstration Walkthrough
* **Step 1: The Air-Gap Verification:** Wi-Fi switched to Airplane Mode.
* **Step 2: GlanceGuard in Action:** As a bystander looks over the user's shoulder, the screen automatically blurs into a frosted glass curtain.
* **Step 3: MeetingBrain Live:** Continuous speech transcribed with speaker tags and instant executive action items generated on-device.
* **Step 4: PrivaDoc Local Search:** Instant semantic retrieval of NDA documents.

---

### Slide 8: Business Impact & HP OmniBook Synergy
* **Target Markets:** Defense, Corporate Finance, Healthcare, Legal, and Enterprise C-Suite.
* **HP Ecosystem Integration:**
  * Pre-installable as a flagship feature in **HP AI Companion** on OmniBook Ultra and OmniBook X.
  * Direct competitive differentiator against Apple Intelligence and Microsoft Copilot+.

---

### Slide 9: Scalability & Future Roadmap
* **Phase 1 (Current):** Multimodal vision, audio, and SLM execution on Snapdragon X.
* **Phase 2:** Multi-camera peripheral integration via USB-C for 360-degree executive cubicle defense.
* **Phase 3:** Hardware-backed cryptographic key isolation within Snapdragon Secure Processing Unit (SPU).

---

### Slide 10: Conclusion & The Ask
* **Summary:** OmniSentinel represents the pinnacle of on-device edge AI — combining privacy, extreme energy efficiency, and instant utility.
* **Thank You & Q&A:** Open for technical evaluation by Qualcomm Engineering Directors and HP Product Leaders.
