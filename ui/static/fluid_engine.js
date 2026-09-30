/**
 * OmniSentinel: Deep Cosmic Galaxy & Snapdragon Fiery Nebula Engine
 * Inspired by Linear (curated.design/sites/s/2659/) & Qualcomm Snapdragon Identity:
 * - 1600+ Multi-magnitude twinkling celestial stars with parallax drift
 * - Volumetric swirling Snapdragon Ruby & Crimson nebula with solar ember highlights
 * - 3D Celestial orbital rings & Qualcomm Hexagon tensor coordinate guides
 * - Interactive gravitational lensing / mouse fluid repulsion
 * - Threat-reactive states:
 *     SAFE: Snapdragon Fiery Ruby & Crimson Cosmic Nebula with Starlight & Quantum Cyan Sparks
 *     THREAT: Blazing Solar Flare / Supernova Alert
 *     PANIC: Gravitational Singularity / Event Horizon Void Collapse
 * - 100% Native HTML5 Canvas physics — Zero external dependencies, pure air-gapped performance.
 */

class CosmicGalaxyEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // State: SAFE (Snapdragon Ruby Nebula), THREAT (Solar Flare), PANIC (Void Singularity)
    this.state = "SAFE";
    this.time = 0;

    // Interactive mouse coordinates with smooth damping
    this.mouse = {
      x: this.width * 0.5,
      y: this.height * 0.45,
      targetX: this.width * 0.5,
      targetY: this.height * 0.45,
      speed: 0
    };

    // Celestial Starfield & Galaxy Particles (1600+ particles)
    this.numParticles = Math.min(1800, Math.floor((this.width * this.height) / 700));
    this.particles = [];
    this.stars = [];
    this._initStars();
    this._initGalaxyParticles();

    this._bindEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // Layer 1: Distant Twinkling Starfield (Deep Space with Snapdragon Ruby & Diamond White Stars)
  _initStars() {
    this.stars = [];
    const numStars = Math.floor(this.numParticles * 0.45);
    for (let i = 0; i < numStars; i++) {
      // Color-coding: mostly pure diamond white, with subtle Snapdragon ruby or warm solar gold accents
      let hue = 0;
      const rand = Math.random();
      if (rand > 0.82) {
        hue = 352; // Snapdragon Ruby Starlight
      } else if (rand > 0.72) {
        hue = 28;  // Warm Solar Ember
      } else if (rand > 0.65) {
        hue = 185; // Hexagon Quantum Cyan
      }

      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 1.8 + 0.3,
        baseAlpha: Math.random() * 0.65 + 0.15,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        depth: Math.random() * 0.8 + 0.2, // Parallax depth layer
        hue: hue
      });
    }
  }

  // Layer 2: Swirling Snapdragon Galaxy Vortex Particles
  _initGalaxyParticles() {
    this.particles = [];
    const centerX = this.width * 0.5;
    const centerY = this.height * 0.45;
    const numGalaxy = Math.floor(this.numParticles * 0.55);

    for (let i = 0; i < numGalaxy; i++) {
      // Golden ratio spiral & logarithmic radial distribution
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.pow(Math.random(), 0.65) * Math.min(this.width, this.height) * 0.62;
      
      this.particles.push({
        baseAngle: angle,
        angle: angle,
        dist: dist,
        baseDist: dist,
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        size: Math.random() * 2.2 + 0.8,
        speed: (0.0018 + Math.random() * 0.0035) * (Math.random() > 0.35 ? 1 : -1),
        radialOscillationSpeed: Math.random() * 0.03 + 0.01,
        hueShift: Math.random() * 60,
        alpha: Math.random() * 0.75 + 0.2,
        baseAlpha: Math.random() * 0.75 + 0.2
      });
    }
  }

  _bindEvents() {
    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this._initStars();
      this._initGalaxyParticles();
    });

    window.addEventListener("mousemove", (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
    });

    window.addEventListener("click", (e) => {
      this.triggerShockwave(e.clientX, e.clientY);
    });
  }

  triggerShockwave(x, y) {
    const shockCenter = { x, y };
    for (let p of this.particles) {
      const dx = p.x - shockCenter.x;
      const dy = p.y - shockCenter.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 360) {
        const force = (360 - dist) * 0.32;
        p.dist += force;
      }
    }
  }

  setState(newState) {
    this.state = newState;
    if (newState === "THREAT") {
      this.triggerShockwave(this.width * 0.5, this.height * 0.45);
    }
  }

  animate() {
    this.time += 0.016;

    // Smooth mouse follow with inertia
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Deep Obsidian Space Canvas with subtle trailing for fluid motion blur
    ctx.fillStyle = "rgba(6, 8, 12, 0.28)";
    ctx.fillRect(0, 0, w, h);

    const mouseShiftX = (this.mouse.x - w * 0.5);
    const mouseShiftY = (this.mouse.y - h * 0.5);
    const centerX = w * 0.5 + mouseShiftX * 0.05;
    const centerY = h * 0.45 + mouseShiftY * 0.05;

    // --- RENDER LAYER 1: Distant Twinkling Starfield ---
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      // Parallax shift based on depth
      const px = s.x - mouseShiftX * (0.015 * s.depth);
      const py = s.y - mouseShiftY * (0.015 * s.depth);

      // Shimmering twinkle
      const twinkle = Math.sin(this.time * 2.5 * s.twinkleSpeed + s.twinklePhase);
      const alpha = Math.max(0.08, Math.min(1.0, s.baseAlpha + twinkle * 0.35));

      ctx.beginPath();
      ctx.arc(px, py, s.size, 0, Math.PI * 2);

      if (s.hue > 0) {
        ctx.fillStyle = `hsla(${s.hue}, 90%, 70%, ${alpha})`;
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      }
      ctx.fill();
    }

    // --- RENDER LAYER 2: Ethereal Snapdragon Cosmic Nebula Glow ---
    const coreGrad = ctx.createRadialGradient(
      centerX, centerY, 20,
      centerX, centerY, Math.min(w, h) * 0.58
    );

    if (this.state === "THREAT") {
      // Blazing Supernova Solar Flare Alert
      coreGrad.addColorStop(0, "rgba(255, 25, 65, 0.34)");
      coreGrad.addColorStop(0.3, "rgba(255, 80, 0, 0.2)");
      coreGrad.addColorStop(0.65, "rgba(200, 10, 40, 0.08)");
      coreGrad.addColorStop(1, "rgba(6, 8, 12, 0)");
    } else if (this.state === "PANIC") {
      // Gravitational Singularity / Event Horizon Void Collapse
      coreGrad.addColorStop(0, "rgba(40, 8, 16, 0.65)");
      coreGrad.addColorStop(0.5, "rgba(20, 4, 8, 0.3)");
      coreGrad.addColorStop(1, "rgba(4, 5, 8, 0)");
    } else {
      // Signature Snapdragon Cosmic Palette:
      // Intense Ruby Core -> Fiery Crimson Mid -> Solar Ember Ring -> Deep Garnet Violet Fade
      coreGrad.addColorStop(0, "rgba(255, 30, 70, 0.22)");
      coreGrad.addColorStop(0.25, "rgba(230, 0, 38, 0.16)");
      coreGrad.addColorStop(0.48, "rgba(255, 120, 20, 0.09)");
      coreGrad.addColorStop(0.72, "rgba(140, 15, 60, 0.05)");
      coreGrad.addColorStop(1, "rgba(6, 8, 12, 0)");
    }

    ctx.fillStyle = coreGrad;
    ctx.fillRect(0, 0, w, h);

    // --- RENDER LAYER 3: Swirling Snapdragon Galaxy Vortex Particles ---
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Swirling angular velocity
      p.angle += p.speed * (this.state === "THREAT" ? 2.6 : 1.0);
      
      // Celestial wave breathing
      const radialWave = Math.sin(this.time * 1.8 + p.baseAngle * 3.5) * 15.0;
      const targetDist = p.baseDist + radialWave;
      p.dist += (targetDist - p.dist) * 0.025;

      // Mouse Gravitational Lensing / Repulsion Field
      const naturalX = centerX + Math.cos(p.angle) * p.dist;
      const naturalY = centerY + Math.sin(p.angle) * p.dist;

      const mDx = naturalX - this.mouse.x;
      const mDy = naturalY - this.mouse.y;
      const mDist = Math.hypot(mDx, mDy);

      let liftX = 0;
      let liftY = 0;
      if (mDist < 170) {
        const repelForce = (170 - mDist) * 0.24;
        liftX = (mDx / (mDist + 0.1)) * repelForce;
        liftY = (mDy / (mDist + 0.1)) * repelForce;
      }

      p.x = naturalX + liftX;
      p.y = naturalY + liftY;

      // Chromatic Snapdragon Color Mapping:
      // Fiery Crimson (350°) -> Snapdragon Ruby (358°) -> Solar Ember (24°) -> Quantum Cyan Tensor Accent (180°)
      let colorStr;
      if (this.state === "THREAT") {
        const hue = 345 + Math.sin(p.angle * 2.0 + this.time) * 30; // Fiery Crimson & Solar Gold
        colorStr = `hsla(${hue}, 100%, 64%, ${p.alpha * 1.3})`;
      } else if (this.state === "PANIC") {
        colorStr = `rgba(255, 30, 70, ${p.alpha * 0.35})`;
      } else {
        const angleNorm = (p.angle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        
        let hue;
        let sat = 95;
        let light = 62;

        if (angleNorm < Math.PI * 0.6) {
          // Pure Snapdragon Red (350 -> 358)
          hue = 350 + (angleNorm / (Math.PI * 0.6)) * 10;
        } else if (angleNorm < Math.PI * 1.1) {
          // Snapdragon Red into Solar Ember (360 -> 24)
          const t = (angleNorm - Math.PI * 0.6) / (Math.PI * 0.5);
          hue = (360 + t * 24) % 360;
        } else if (angleNorm < Math.PI * 1.5) {
          // Solar Ember into Rich Crimson Ruby (24 -> 345)
          const t = (angleNorm - Math.PI * 1.1) / (Math.PI * 0.4);
          hue = 24 - t * 39;
          if (hue < 0) hue += 360;
        } else {
          // Occasional Quantum Tensor Spark (Hexagon Cyan 185)
          if (i % 7 === 0) {
            hue = 185; // Quantum Cyan
            light = 70;
          } else {
            hue = 354; // Snapdragon Red
          }
        }

        colorStr = `hsla(${hue}, ${sat}%, ${light}%, ${p.alpha})`;
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = colorStr;
      ctx.fill();
    }

    // --- RENDER LAYER 4: 3D Celestial Orbital Guides & Defined Crosshairs ---
    this._renderCelestialOrbitalGuides(ctx, w, h, centerX, centerY);

    requestAnimationFrame(this.animate);
  }

  _renderCelestialOrbitalGuides(ctx, w, h, cx, cy) {
    ctx.save();
    
    // Subtle 3D perspective orbital ellipse in Snapdragon Ruby tint
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255, 45, 85, 0.06)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.min(w, h) * 0.42, Math.min(w, h) * 0.22, -0.15, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.min(w, h) * 0.62, Math.min(w, h) * 0.32, -0.15, 0, Math.PI * 2);
    ctx.stroke();

    // Defined Framing Crosshairs [+] at edge margins
    const pad = 36;
    const crossSize = 7;
    const corners = [
      { x: pad, y: pad },
      { x: w - pad, y: pad },
      { x: w - pad, y: h - pad },
      { x: pad, y: h - pad }
    ];

    ctx.strokeStyle = "rgba(255, 45, 85, 0.22)";
    for (let c of corners) {
      ctx.beginPath();
      ctx.moveTo(c.x - crossSize, c.y);
      ctx.lineTo(c.x + crossSize, c.y);
      ctx.moveTo(c.x, c.y - crossSize);
      ctx.lineTo(c.x, c.y + crossSize);
      ctx.stroke();
    }

    ctx.restore();
  }
}

// Global Export
window.CosmicGalaxyEngine = CosmicGalaxyEngine;
window.DefinedVortexEngine = CosmicGalaxyEngine;
window.Fluid3DEngine = CosmicGalaxyEngine;
