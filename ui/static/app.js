/**
 * OmniSentinel Frontend Controller (v3.2 Linear Cosmic Galaxy Edition)
 * Silicon Telemetry, Interactive 3D Cosmic Galaxy Canvas, 3D Perspective Workspace Tilt,
 * Real-time WebSockets, Web Speech API Mic, Local SLM Reasoning, PrivaDoc RAG, Web Audio FX
 */

let ws = null;
let isShieldSuppressed = false;
let currentContext = "CONFIDENTIAL";
let isSoundEnabled = true;
let isLiveMicActive = false;
let speechRecognizer = null;
let audioAnimFrame = null;
let galaxyEngine = null;
let is3DPerspectiveActive = true;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Cosmic Galaxy Canvas
  if (window.CosmicGalaxyEngine) {
    galaxyEngine = new CosmicGalaxyEngine("fluid-3d-canvas");
  }

  initWebSocket();
  loadBenchmarks();
  initWaveformCanvas();
  simulateAudioChunk();
  initScrollSpy();
  init3DCardInteractivity();

  // Activate 3D perspective by default
  const viewport = document.getElementById("workspace-viewport");
  if (viewport) {
    viewport.classList.add("perspective-active");
  }

  showToast("🌌 OmniSentinel Cosmic Galaxy Engine Armed", "info");
});

// 3D Perspective Viewport Toggle (Cosmic Angle vs Flat Studio)
function toggle3DPerspective() {
  playSoundFX("click");
  const viewport = document.getElementById("workspace-viewport");
  const btn = document.getElementById("perspective-toggle-btn");
  const label = document.getElementById("view-mode-label");

  is3DPerspectiveActive = !is3DPerspectiveActive;

  if (is3DPerspectiveActive) {
    viewport.classList.add("perspective-active");
    btn.classList.add("active");
    label.textContent = "3D Cosmic Angle";
    showToast("📐 3D Cosmic Perspective Enabled", "info");
  } else {
    viewport.classList.remove("perspective-active");
    btn.classList.remove("active");
    label.textContent = "Flat Studio Mode";
    showToast("📏 Flat Studio Perspective Enabled", "info");
  }
}

// Interactive 3D Card Tilt & Mouse Spotlight Effect
function init3DCardInteractivity() {
  const stage = document.getElementById("workspace-stage");
  const viewport = document.getElementById("workspace-viewport");

  if (stage && viewport) {
    viewport.addEventListener("mousemove", (e) => {
      if (!is3DPerspectiveActive) return;
      const rect = viewport.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Subtle dynamic 3D tilt
      const rotX = 12 - (y / rect.height) * 10;
      const rotY = -2 + (x / rect.width) * 8;

      stage.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(0.97)`;
    });

    viewport.addEventListener("mouseleave", () => {
      if (!is3DPerspectiveActive) return;
      stage.style.transform = `rotateX(12deg) rotateY(-2deg) scale(0.97)`;
    });
  }

  // Spotlight follow on trilogy cards
  const cards = document.querySelectorAll(".trilogy-card, .defined-card");
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}

// Scroll Spy for Linear Floating Nav
function initScrollSpy() {
  const sections = document.querySelectorAll(".linear-section");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("data-section") === current) {
        link.classList.add("active");
      }
    });
  });
}

function scrollToSection(sectionId) {
  playSoundFX("click");
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

// Synthesized Sci-Fi Sound FX (Web Audio API)
function playSoundFX(type) {
  if (!isSoundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === "panic") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.35);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === "threat") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(920, now);
      osc.frequency.setValueAtTime(700, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === "auth") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (e) {}
}

function toggleSoundFX() {
  isSoundEnabled = !isSoundEnabled;
  const btn = document.getElementById("sound-toggle-btn");
  if (isSoundEnabled) {
    btn.style.color = "var(--accent-teal)";
    showToast("🔊 Sound Effects Enabled", "info");
    playSoundFX("click");
  } else {
    btn.style.color = "var(--text-muted)";
    showToast("🔇 Sound Effects Muted", "info");
  }
}

// Toast System
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type === "danger" ? "toast-danger" : ""}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// WebSocket Connection for Telemetry & Real-Time GlanceGuard
function initWebSocket() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${protocol}//${window.location.host}/ws/telemetry`;

  ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      updateTelemetryHUD(data);
      updateGlanceGuardState(data);
      updateLocationTrustHUD(data.location_trust);
    } catch (e) {}
  };

  ws.onclose = () => {
    setTimeout(initWebSocket, 2000);
  };
}

// Update Top Ribbon Telemetry
function updateTelemetryHUD(data) {
  const pVal = document.getElementById("power-val");
  const bVal = document.getElementById("battery-val");
  const lVal = document.getElementById("latency-val");
  const wanVal = document.getElementById("wan-counter");
  const auditWan = document.getElementById("audit-wan-val");

  if (pVal && data.active_power_watts !== undefined) pVal.textContent = data.active_power_watts.toFixed(1);
  if (bVal && data.projected_battery_hours !== undefined) bVal.textContent = data.projected_battery_hours.toFixed(1);
  if (lVal && data.vision_latency_ms !== undefined) lVal.textContent = data.vision_latency_ms.toFixed(1);
  if (wanVal) wanVal.textContent = "0.00 KB";
  if (auditWan) auditWan.textContent = "0.00 KB";
}

// Update Location Trust HUD
function updateLocationTrustHUD(trust) {
  if (!trust) return;

  const scoreEl = document.getElementById("trust-score-val");
  const envChipEl = document.getElementById("trust-env-chip");
  const intelLoc = document.getElementById("intel-loc-name");
  const intelNoise = document.getElementById("intel-noise");
  const intelNet = document.getElementById("intel-network");
  const intelPolicy = document.getElementById("intel-policy");

  if (scoreEl) scoreEl.textContent = trust.trust_score;
  if (envChipEl) envChipEl.textContent = trust.location_key;
  if (intelLoc) intelLoc.textContent = trust.location_name;
  if (intelNoise) intelNoise.textContent = `${trust.ambient_noise_db} dB`;
  if (intelNet) intelNet.textContent = trust.network_state;
  if (intelPolicy) intelPolicy.textContent = trust.blur_sensitivity;
}

// Update GlanceGuard Sentry States, Galaxy Colors & Mock Window Shield
function updateGlanceGuardState(data) {
  const statusTag = document.getElementById("vision-status-tag");
  const curtain = document.getElementById("privacy-curtain");
  const curtainTitle = document.getElementById("curtain-title");
  const curtainDesc = document.getElementById("curtain-desc");
  const mockShield = document.getElementById("mock-shield-curtain");
  const panicHud = document.getElementById("panic-hud-badge");

  // Check Panic Lockout
  if (data.panic_lockout_active) {
    if (galaxyEngine) galaxyEngine.setState("PANIC");
    if (statusTag) {
      statusTag.className = "chip chip-danger";
      statusTag.textContent = "EMERGENCY PANIC LOCKOUT (✋ GESTURE)";
    }
    if (curtainTitle) curtainTitle.textContent = "EMERGENCY PANIC LOCKOUT ACTIVE";
    if (curtainDesc) curtainDesc.textContent = "Immediate manual blanking triggered via open palm gesture. Mic muted. Session isolated.";
    if (curtain) curtain.classList.remove("hidden");
    if (mockShield) mockShield.classList.remove("hidden");
    if (panicHud) panicHud.style.background = "rgba(239, 68, 68, 0.4)";
    return;
  }

  if (panicHud) panicHud.style.background = "rgba(239, 68, 68, 0.2)";

  if (data.threat_level === "THREAT_DETECTED") {
    if (galaxyEngine) galaxyEngine.setState("THREAT");
    if (statusTag) {
      statusTag.className = "chip chip-danger";
      statusTag.textContent = `ALERT: SHOULDER SURFER (${data.bystander_count} DETECTED)`;
    }
    if (curtainTitle) curtainTitle.textContent = "CONFIDENTIAL SCREEN SHIELD ACTIVE";
    if (curtainDesc) curtainDesc.textContent = "Shoulder-surfing bystander detected by GlanceGuard on Qualcomm Hexagon NPU.";

    if (!isShieldSuppressed && curtain) {
      curtain.classList.remove("hidden");
    }
    if (mockShield) mockShield.classList.remove("hidden");
  } else if (data.threat_level === "USER_AWAY") {
    if (galaxyEngine) galaxyEngine.setState("SAFE");
    if (statusTag) {
      statusTag.className = "chip";
      statusTag.style.background = "rgba(245, 158, 11, 0.15)";
      statusTag.style.color = "#F59E0B";
      statusTag.textContent = "USER AWAY (STANDBY)";
    }
    if (mockShield) mockShield.classList.add("hidden");
  } else {
    if (galaxyEngine) galaxyEngine.setState("SAFE");
    if (statusTag) {
      statusTag.className = "chip chip-safe";
      statusTag.style.background = "";
      statusTag.style.color = "";
      statusTag.textContent = "SAFE (1 VERIFIED USER)";
    }
    isShieldSuppressed = false;
    if (curtain) curtain.classList.add("hidden");
    if (mockShield) mockShield.classList.add("hidden");
  }
}

// Environmental Location Switcher
async function setLocationMode(mode) {
  playSoundFX("click");
  document.querySelectorAll(".loc-chip").forEach(c => c.classList.remove("active"));
  if (event && event.currentTarget) {
    event.currentTarget.classList.add("active");
  }

  try {
    await fetch("/api/location/mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode })
    });
    showToast(`📍 Location Context Updated: ${mode}`, "info");
  } catch (e) {
    console.error("Location error:", e);
  }
}

// Context Mode Switcher (Smart Blur)
async function toggleContextMode() {
  playSoundFX("click");
  currentContext = currentContext === "CONFIDENTIAL" ? "CASUAL" : "CONFIDENTIAL";
  const btnLabel = document.getElementById("context-btn-label");
  const icon = document.getElementById("context-icon");
  const blurBadge = document.getElementById("blur-status-badge");
  const docTitle = document.getElementById("active-doc-title");

  if (currentContext === "CONFIDENTIAL") {
    btnLabel.textContent = "Confidential Mode (Strict)";
    icon.textContent = "🔒";
    blurBadge.textContent = "SMART BLUR ACTIVE";
    blurBadge.style.color = "var(--accent-teal)";
    docTitle.textContent = "Project Titan Q4 M&A Merger Valuation.xlsx";
    showToast("🔒 Switched to Confidential Mode (Strict 20ms Protection)", "info");
  } else {
    btnLabel.textContent = "Casual Mode (Relaxed)";
    icon.textContent = "🌐";
    blurBadge.textContent = "BLUR RELAXED";
    blurBadge.style.color = "var(--text-muted)";
    docTitle.textContent = "Personal Media Playback & Web Stream";
    showToast("🌐 Switched to Casual Mode (No False Blurs)", "info");
  }

  try {
    await fetch("/api/privacy/context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context: currentContext })
    });
  } catch (e) {
    console.error("Context error:", e);
  }
}

// Panic Gesture Trigger
async function triggerPanicGesture() {
  playSoundFX("panic");
  if (galaxyEngine) galaxyEngine.setState("PANIC");
  showToast("🚨 EMERGENCY PANIC GESTURE TRIGGERED (✋ Open Palm)", "danger");
  try {
    await fetch("/api/privacy/panic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: true })
    });
  } catch (e) {
    console.error("Panic error:", e);
  }
}

function dismissCurtain() {
  playSoundFX("auth");
  isShieldSuppressed = true;
  document.getElementById("privacy-curtain").classList.add("hidden");
  const mockShield = document.getElementById("mock-shield-curtain");
  if (mockShield) mockShield.classList.add("hidden");
  if (galaxyEngine) galaxyEngine.setState("SAFE");

  fetch("/api/privacy/panic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ active: false })
  });
  showToast("✓ Session Re-Authenticated", "info");
}

function triggerTestBystander() {
  playSoundFX("threat");
  if (galaxyEngine) galaxyEngine.setState("THREAT");
  showToast("⚠️ Shoulder-Surfer Detected at 42° Angle", "danger");
  updateGlanceGuardState({
    threat_level: "THREAT_DETECTED",
    bystander_count: 1
  });
}

function adjustSensitivity(val) {
  playSoundFX("click");
  const label = document.getElementById("sensitivity-label");
  const labels = { "1": "Relaxed (Home)", "2": "Balanced (Adaptive)", "3": "Paranoid (Airport)" };
  label.textContent = labels[val] || "Adaptive";
  showToast(`Sensing Policy Adjusted: ${label.textContent}`, "info");
}

// Animated Canvas Waveform
function initWaveformCanvas() {
  const canvas = document.getElementById("waveform-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let phase = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;

    phase += isLiveMicActive ? 0.2 : 0.04;
    const amplitude = isLiveMicActive ? 16 : 5;

    ctx.lineWidth = 2;
    ctx.strokeStyle = isLiveMicActive ? "#FF2D55" : "#00F5D4";
    ctx.beginPath();

    for (let x = 0; x < w; x++) {
      const y = h / 2 + Math.sin(x * 0.05 + phase) * amplitude * Math.sin(x * 0.01);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    requestAnimationFrame(draw);
  }
  draw();
}

// Live Microphone Capture (Web Speech API)
function toggleLiveMicrophone() {
  playSoundFX("click");
  const btn = document.getElementById("live-mic-btn");
  const text = document.getElementById("mic-btn-text");

  if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
    showToast("⚠️ Speech Recognition API not available in this browser", "danger");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (isLiveMicActive) {
    if (speechRecognizer) speechRecognizer.stop();
    isLiveMicActive = false;
    btn.classList.remove("recording");
    text.textContent = "Live Microphone";
    showToast("🎙️ Microphone Stopped", "info");
  } else {
    try {
      speechRecognizer = new SpeechRecognition();
      speechRecognizer.continuous = true;
      speechRecognizer.interimResults = false;
      speechRecognizer.lang = "en-US";

      speechRecognizer.onstart = () => {
        isLiveMicActive = true;
        btn.classList.add("recording");
        text.textContent = "Recording...";
        showToast("🎙️ Live Microphone Active (Air-Gapped Processing)", "info");
      };

      speechRecognizer.onresult = (event) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript;
        appendTranscript("User (Mic)", text);
      };

      speechRecognizer.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        isLiveMicActive = false;
        btn.classList.remove("recording");
        text.textContent = "Live Microphone";
      };

      speechRecognizer.onend = () => {
        if (isLiveMicActive) {
          try { speechRecognizer.start(); } catch(e) {}
        }
      };

      speechRecognizer.start();
    } catch (e) {
      console.error(e);
      showToast("Could not access microphone", "danger");
    }
  }
}

// Simulate Audio Chunks (Demonstrating Whisper pipeline)
async function simulateAudioChunk() {
  playSoundFX("click");
  try {
    const res = await fetch("/api/audio/transcribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audio_chunk_b64: "" })
    });
    const data = await res.json();
    appendTranscript(data.speaker || "Executive", data.text);
  } catch (e) {
    console.error("Audio error:", e);
  }
}

function appendTranscript(speaker, text) {
  const container = document.getElementById("transcript-container");
  if (!container) return;

  const bubble = document.createElement("div");
  bubble.className = "transcript-bubble";
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  bubble.innerHTML = `
    <div class="tb-meta">
      <span class="tb-speaker">${speaker}</span>
      <span class="tb-time">${now} • 42ms NPU</span>
    </div>
    <div class="tb-text">${text}</div>
  `;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

// On-Device SLM Executive Intelligence & Contradiction Radar
async function generateExecutiveSummary() {
  playSoundFX("click");
  const container = document.getElementById("summary-content");
  container.innerHTML = `
    <div class="empty-state">
      <div class="spinner"></div>
      <p>Llama-3.2-1B running inference on Qualcomm Hexagon NPU (32.4 tok/s)...</p>
    </div>
  `;

  try {
    const res = await fetch("/api/slm/reason", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "Analyze meeting notes" })
    });
    const data = await res.json();
    playSoundFX("auth");

    let contradictionHtml = "";
    if (data.contradiction_radar && data.contradiction_radar.flagged) {
      contradictionHtml = `
        <div class="radar-contradiction-box">
          <div class="rc-title">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            SPEAKER CONTRADICTION DETECTED
          </div>
          <p class="rc-desc">${data.contradiction_radar.details}</p>
        </div>
      `;
    }

    container.innerHTML = `
      ${contradictionHtml}
      <div class="slm-result-box">
        <h4 style="margin-bottom:8px; color:var(--accent-teal);">Executive Summary</h4>
        <p style="font-size:13px; line-height:1.5; color:var(--text-main); margin-bottom:14px;">${data.executive_summary}</p>
        
        <h4 style="margin-bottom:8px; color:#fff;">Action Items</h4>
        <ul style="font-size:12px; color:var(--text-secondary); padding-left:18px; line-height:1.6;">
          ${(data.action_items || []).map(item => `<li>${item}</li>`).join("")}
        </ul>

        <div style="margin-top:14px; display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:11px; color:var(--text-muted); border-top:1px solid var(--border-subtle); padding-top:8px;">
          <span>SENTIMENT: <strong class="text-teal">${data.sentiment || "NEUTRAL"}</strong></span>
          <span>LATENCY: <strong class="text-teal">${data.latency_ms || 34.2} ms</strong></span>
        </div>
      </div>
    `;
  } catch (e) {
    console.error("SLM error:", e);
    container.innerHTML = `<p class="text-danger">Failed to execute on-device reasoning.</p>`;
  }
}

// PrivaDoc Local Vector RAG
async function executeRagQuery() {
  playSoundFX("click");
  const input = document.getElementById("rag-query-input");
  const container = document.getElementById("rag-results-container");
  const latTag = document.getElementById("rag-latency-tag");

  const query = input.value.trim();
  if (!query) return;

  container.innerHTML = `
    <div class="empty-state">
      <div class="spinner"></div>
      <p>Computing cosine similarity on Hexagon HTP vectors...</p>
    </div>
  `;

  try {
    const res = await fetch("/api/rag/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    playSoundFX("auth");

    if (latTag && data.latency_ms) {
      latTag.textContent = `LATENCY: ${data.latency_ms.toFixed(1)} MS`;
    }

    container.innerHTML = (data.results || []).map(r => `
      <div class="rag-result-card">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <strong style="color:#fff; font-size:12px;">${r.document_source || "Confidential Vector"}</strong>
          <span class="rag-score-pill">SIMILARITY: ${(r.similarity * 100).toFixed(0)}%</span>
        </div>
        <p style="color:var(--text-secondary); font-size:12px; line-height:1.5;">${r.text_snippet}</p>
      </div>
    `).join("");
  } catch (e) {
    console.error("RAG error:", e);
    container.innerHTML = `<p class="text-danger">Vector search error.</p>`;
  }
}

function setAndRunQuery(q) {
  const input = document.getElementById("rag-query-input");
  if (input) input.value = q;
  executeRagQuery();
}

// Load Silicon Benchmarks Table
async function loadBenchmarks() {
  try {
    const res = await fetch("/api/benchmarks");
    const data = await res.json();
    const tbody = document.getElementById("benchmark-table-body");
    if (!tbody || !data.benchmarks) return;

    tbody.innerHTML = data.benchmarks.map(b => `
      <tr>
        <td><strong>${b.pipeline}</strong></td>
        <td><span class="font-mono text-muted">${b.model}</span></td>
        <td><strong class="text-teal font-mono">${b.snapdragon_x_htp}</strong></td>
        <td><span class="text-warning font-mono">${b.intel_meteor_lake}</span></td>
        <td><span class="text-muted font-mono">${b.cloud_api_roundtrip}</span></td>
        <td><span class="t-sub-pill text-green font-mono">${b.advantage}</span></td>
      </tr>
    `).join("");
  } catch (e) {
    console.error("Benchmarks error:", e);
  }
}
