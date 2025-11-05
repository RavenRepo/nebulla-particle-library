import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";
import { ParticleSystem } from "./ParticleSystem.js";
import { PerformanceMonitor } from "./utils/PerformanceMonitor.js";
import { MouseInteraction } from "./MouseInteraction.js";
import { SettingsPanel } from "./SettingsPanel.js";

/**
 * ParticleWaveApp - Main application class
 * Combines Grok's implementation approach with Claude's architecture patterns
 */
class ParticleWaveApp {
  constructor() {
    // Core Three.js components
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.composer = null;
    this.controls = null;

    // Custom components
    this.particleSystem = null;
    this.performanceMonitor = new PerformanceMonitor();
    this.mouseInteraction = null;
    this.settingsPanel = null;

    // Animation state
    this.clock = new THREE.Clock();
    this.isInitialized = false;

    // UI elements
    this.loadingElement = document.getElementById("loading");
    this.fpsElement = document.getElementById("fps");
    this.particleCountElement = document.getElementById("particle-count");
    this.memoryElement = document.getElementById("memory");

    // Configuration
    this.config = {
      enableOrbitControls: false, // Set to true for debugging
      enablePostProcessing: true,
      particleCount: this.detectOptimalParticleCount(),
    };

    this.init();
  }

  /**
   * Detect optimal particle count based on device capabilities
   */
  detectOptimalParticleCount() {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    const pixelRatio = window.devicePixelRatio || 1;

    if (isMobile) {
      return { resolutionX: 200, resolutionZ: 150 }; // 30,000 particles
    } else if (pixelRatio > 2) {
      return { resolutionX: 380, resolutionZ: 260 }; // 98,800 particles (exact spec)
    } else {
      return { resolutionX: 380, resolutionZ: 260 }; // 98,800 particles (exact spec)
    }
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log("🚀 Initializing Particle Wave Animation...");

      this.createRenderer();
      this.createScene();
      this.createCamera();
      this.createLights();
      this.createParticleSystem();
      this.createMouseInteraction();

      if (this.config.enablePostProcessing) {
        this.createPostProcessing();
      }

      if (this.config.enableOrbitControls) {
        this.createControls();
      }

      // Create settings panel (must be after all systems are created)
      this.createSettingsPanel();

      this.addEventListeners();
      this.hideLoading();

      // Start animation loop
      this.isInitialized = true;
      this.animate();

      console.log("✅ Initialization complete!");
    } catch (error) {
      console.error("❌ Initialization failed:", error);
      this.showError(error.message);
    }
  }

  /**
   * Create WebGL renderer
   */
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 1);

    // Append canvas to body
    document.body.appendChild(this.renderer.domElement);

    console.log("✅ Renderer created");
  }

  /**
   * Create Three.js scene
   */
  createScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.002);
    console.log("✅ Scene created");
  }

  /**
   * Create and configure camera
   */
  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      60, // FOV
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near plane
      100, // Far plane
    );

    // Position camera for low-angle cinematic view (exact spec)
    this.camera.position.set(15, 12, 25);
    this.camera.lookAt(0, 0, 0);

    console.log("✅ Camera created");
  }

  /**
   * Create scene lighting (subtle, for depth perception)
   */
  createLights() {
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0x1a0033, 0.3);
    this.scene.add(ambientLight);

    // Point light for highlights (subtle cosmic glow)
    const pointLight = new THREE.PointLight(0x4a1a8c, 0.5, 50);
    pointLight.position.set(0, 10, 10);
    this.scene.add(pointLight);

    console.log("✅ Lights created");
  }

  /**
   * Create particle system
   */
  createParticleSystem() {
    const config = {
      width: 60,
      depth: 40,
      ...this.config.particleCount,
      particleSize: 3.5, // Precise particle sizing for nebula effect
      waveSpeed: 0.8,
      waveFrequencyX: 0.08,
      waveFrequencyZ: 0.12,
      waveAmplitude: 6.0,
    };

    this.particleSystem = new ParticleSystem(config);
    const particleMesh = this.particleSystem.getMesh();

    // Apply 45° diagonal tilt (exact spec)
    particleMesh.rotation.x = -Math.PI * 0.3;
    particleMesh.rotation.y = Math.PI * 0.15;

    this.scene.add(particleMesh);

    console.log("✅ Particle system created with 45° diagonal tilt");
    console.log("Particle mesh:", particleMesh);
    console.log("Particle mesh visible:", particleMesh.visible);
    console.log("Particle mesh position:", particleMesh.position);
    console.log("Particle mesh scale:", particleMesh.scale);
    console.log("Particle mesh geometry:", particleMesh.geometry);
    console.log(
      "Particle count:",
      particleMesh.geometry.attributes.position.count,
    );
    console.log("Particle mesh material:", particleMesh.material);
    console.log("Material type:", particleMesh.material.type);
    console.log("Material transparent:", particleMesh.material.transparent);
    console.log("Material blending:", particleMesh.material.blending);
    console.log("Material uniforms:", particleMesh.material.uniforms);
    console.log(
      "Shader compiled:",
      !particleMesh.material.isShaderMaterial || particleMesh.material.program,
    );
    console.log("Scene children:", this.scene.children.length);

    // Update UI
    if (this.particleCountElement) {
      this.particleCountElement.textContent = this.particleSystem
        .getParticleCount()
        .toLocaleString();
    }

    // Debug cube removed - particles working now!
  }

  /**
   * Create mouse interaction system
   */
  createMouseInteraction() {
    this.mouseInteraction = new MouseInteraction(this.camera, this.renderer);
    console.log("✅ Mouse interaction created");
  }

  /**
   * Create settings panel (lil-gui)
   */
  createSettingsPanel() {
    this.settingsPanel = new SettingsPanel(this);
    console.log("✅ Settings panel created (Press G to toggle)");
  }

  /**
   * Create post-processing effects (Bloom for glow)
   */
  createPostProcessing() {
    // Create composer
    this.composer = new EffectComposer(this.renderer);

    // Render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Bloom pass (exact spec: strength=2.0, radius=0.8, threshold=0.0)
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      2.0, // Strength (full-spectrum bloom)
      0.8, // Radius
      0.0, // Threshold (glow everything)
    );

    this.composer.addPass(bloomPass);

    // Afterimage pass for motion blur/trails (cinematic effect)
    const afterimagePass = new AfterimagePass(0.88); // Moderate trail persistence
    this.composer.addPass(afterimagePass);

    console.log("✅ Post-processing created: Bloom + Motion Blur (exact spec)");
  }

  /**
   * Create orbit controls (for debugging)
   */
  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 50;
    this.controls.maxPolarAngle = Math.PI / 2;

    console.log("✅ Orbit controls created (debugging mode)");
  }

  /**
   * Main animation loop
   */
  animate() {
    if (!this.isInitialized) return;

    requestAnimationFrame(() => this.animate());

    // Performance monitoring
    this.performanceMonitor.startFrame();

    // Get delta time
    const deltaTime = this.clock.getDelta();

    // Update mouse interaction
    if (this.mouseInteraction) {
      this.mouseInteraction.update();
    }

    // Update particle system
    this.performanceMonitor.markParticleUpdateStart();
    if (this.particleSystem) {
      this.particleSystem.update(
        deltaTime,
        this.mouseInteraction
          ? this.mouseInteraction.getMouseWorldPosition()
          : null,
        this.mouseInteraction ? this.mouseInteraction.isActive() : false,
      );
    }
    this.performanceMonitor.markParticleUpdateEnd();

    // Update controls (if enabled)
    if (this.controls) {
      this.controls.update();
    }

    // Optional: Subtle camera animation
    // this.camera.position.x = Math.sin(this.clock.elapsedTime * 0.1) * 5;
    // this.camera.lookAt(0, 0, 0);

    // Debug: Log particle mesh state every 60 frames
    if (
      this.performanceMonitor.getFrameCount() % 60 === 0 &&
      this.particleSystem
    ) {
      const mesh = this.particleSystem.getMesh();
      console.log("🔍 Particle Mesh Debug:");
      console.log("  - Visible:", mesh.visible);
      console.log("  - Position:", mesh.position);
      console.log(
        "  - Geometry vertices:",
        mesh.geometry.attributes.position.count,
      );
      console.log("  - Material:", mesh.material);
      console.log("  - Material uniforms:", mesh.material.uniforms);
      console.log("  - Scene children:", this.scene.children.length);
    }

    // Render
    this.performanceMonitor.markRenderStart();
    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
    this.performanceMonitor.markRenderEnd();

    this.performanceMonitor.endFrame();

    // Update UI
    this.updateStats();

    // Performance warning
    if (this.performanceMonitor.isPerformanceLow(25)) {
      this.showPerformanceWarning();
    }
  }

  /**
   * Update performance stats in UI
   */
  updateStats() {
    if (this.fpsElement) {
      this.fpsElement.textContent = this.performanceMonitor.getFPS();
    }

    if (this.memoryElement) {
      const memory = this.performanceMonitor.getMemoryUsage();
      this.memoryElement.textContent = memory !== "--" ? `${memory}MB` : memory;
    }
  }

  /**
   * Handle window resize
   */
  onWindowResize() {
    // Update camera
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Update composer
    if (this.composer) {
      this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    // Update particle system pixel ratio
    if (this.particleSystem) {
      this.particleSystem.updatePixelRatio();
    }

    console.log("🔄 Window resized");
  }

  /**
   * Handle visibility change (pause when tab is hidden)
   */
  onVisibilityChange() {
    if (document.hidden) {
      this.clock.stop();
      console.log("⏸️  Animation paused (tab hidden)");
    } else {
      this.clock.start();
      console.log("▶️  Animation resumed");
    }
  }

  /**
   * Add event listeners
   */
  addEventListeners() {
    window.addEventListener("resize", () => this.onWindowResize());
    document.addEventListener("visibilitychange", () =>
      this.onVisibilityChange(),
    );

    // Keyboard shortcuts
    window.addEventListener("keydown", (e) => this.handleKeyPress(e));
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyPress(event) {
    switch (event.key.toLowerCase()) {
      case "p":
        // Toggle performance stats logging
        this.performanceMonitor.logReport();
        break;
      case "r":
        // Reset particle system
        if (this.particleSystem) {
          this.particleSystem.resetTime();
          console.log("🔄 Particle system reset");
        }
        break;
      case "f":
        // Toggle fullscreen
        this.toggleFullscreen();
        break;
      case "h":
        // Toggle info panel
        this.toggleInfo();
        break;
      case "g":
        // Toggle settings panel (handled by SettingsPanel)
        break;
    }
  }

  /**
   * Toggle fullscreen mode
   */
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Failed to enter fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  /**
   * Toggle info panel visibility
   */
  toggleInfo() {
    const info = document.getElementById("info");
    const stats = document.getElementById("stats");

    if (info) {
      info.style.display = info.style.display === "none" ? "block" : "none";
    }
    if (stats) {
      stats.style.display = stats.style.display === "none" ? "block" : "none";
    }
  }

  /**
   * Hide loading screen
   */
  hideLoading() {
    if (this.loadingElement) {
      setTimeout(() => {
        this.loadingElement.classList.add("hidden");
      }, 500);
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    if (this.loadingElement) {
      this.loadingElement.innerHTML = `
        <div style="color: #ff4444;">
          ❌ Error: ${message}
        </div>
      `;
    }
  }

  /**
   * Show performance warning (only once)
   */
  showPerformanceWarning() {
    if (this._performanceWarningShown) return;
    this._performanceWarningShown = true;

    console.warn("⚠️  Low performance detected. Consider:");
    console.warn("   - Reducing particle count");
    console.warn("   - Disabling post-processing");
    console.warn("   - Closing other applications");
  }

  /**
   * Dispose of resources (for cleanup)
   */
  dispose() {
    if (this.particleSystem) {
      this.particleSystem.dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.composer) {
      this.composer.dispose();
    }

    console.log("🗑️  Application disposed");
  }
}

// Initialize application when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.app = new ParticleWaveApp();
  });
} else {
  window.app = new ParticleWaveApp();
}

// Expose app globally for debugging
console.log("💡 Keyboard shortcuts:");
console.log("   P - Log performance report");
console.log("   R - Reset animation");
console.log("   F - Toggle fullscreen");
console.log("   H - Toggle info panels");
console.log("   G - Toggle settings panel");
