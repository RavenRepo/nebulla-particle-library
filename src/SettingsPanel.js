import GUI from "lil-gui";

/**
 * SettingsPanel - Real-time control panel for all nebula parameters
 * Uses lil-gui for a sleek, professional interface
 */
export class SettingsPanel {
  constructor(app) {
    this.app = app;
    this.gui = new GUI({ title: "🌌 Nebula Controls", width: 320 });

    // Settings object to bind to GUI
    this.settings = {
      // Particle System
      particleSize: 3.5,
      particleCount: "98,800 (380×260)",

      // Animation Mode
      useCurlNoise: false,
      curlStrength: 2.5,
      noiseScale: 0.15,

      // Wave Parameters
      waveFrequency1: 0.07,
      waveAmplitude1: 5.5,
      waveSpeed1: 0.7,
      waveFrequency2: 0.12,
      waveAmplitude2: 3.0,
      waveSpeed2: 0.91,

      // Noise Parameters
      noiseScale1: 0.04,
      noiseAmplitude1: 4.0,
      noiseSpeed1: 0.25,
      noiseScale2: 0.1,
      noiseAmplitude2: 1.5,
      noiseSpeed2: 0.4,

      // Density
      densityMin: -4.0,
      densityMax: 6.0,
      densityAlphaMin: 0.2,
      densityAlphaMax: 0.8,
      densitySizeBoost: 0.7,

      // Colors (RGB 0-1)
      color1: { r: 0.1 * 255, g: 0.15 * 255, b: 0.4 * 255 }, // Deep Blue
      color2: { r: 0.5 * 255, g: 0.1 * 255, b: 0.7 * 255 }, // Violet
      color3: { r: 1.0 * 255, g: 0.3 * 255, b: 0.8 * 255 }, // Magenta
      color4: { r: 1.0 * 255, g: 0.4 * 255, b: 0.3 * 255 }, // Crimson

      // Mouse Interaction
      mouseInteractionEnabled: true,
      mouseRadius: 8.0,
      mouseStrength: 5.0,

      // Post-Processing
      bloomStrength: 2.0,
      bloomRadius: 0.8,
      bloomThreshold: 0.0,
      motionBlur: 0.88,

      // Camera
      cameraX: 15,
      cameraY: 12,
      cameraZ: 25,
      rotationX: -Math.PI * 0.3,
      rotationY: Math.PI * 0.15,

      // Actions
      resetCamera: () => this.resetCamera(),
      resetAll: () => this.resetAll(),
      exportSettings: () => this.exportSettings(),
      toggleInfo: () => this.toggleInfo(),
    };

    this.createGUI();
    this.addKeyboardShortcut();
  }

  /**
   * Create the GUI structure
   */
  createGUI() {
    // Particle System Folder
    const particleFolder = this.gui.addFolder("⚡ Particle System");
    particleFolder
      .add(this.settings, "particleSize", 1, 20, 0.1)
      .name("Particle Size")
      .onChange((value) => this.updateParticleSize(value));
    particleFolder
      .add(this.settings, "particleCount")
      .name("Particle Count")
      .disable();
    particleFolder.open();

    // Animation Mode Folder
    const animationFolder = this.gui.addFolder("🌊 Animation Mode");
    animationFolder
      .add(this.settings, "useCurlNoise")
      .name("Use Curl Noise")
      .onChange((value) => this.toggleCurlNoise(value));
    animationFolder
      .add(this.settings, "curlStrength", 0.5, 5.0, 0.1)
      .name("Curl Strength")
      .onChange((value) => this.updateCurlStrength(value));
    animationFolder
      .add(this.settings, "noiseScale", 0.05, 0.5, 0.01)
      .name("Noise Scale")
      .onChange((value) => this.updateNoiseScale(value));
    animationFolder.open();

    // Wave Parameters Folder
    const waveFolder = this.gui.addFolder("🌊 Wave Displacement");
    waveFolder
      .add(this.settings, "waveFrequency1", 0.01, 0.2, 0.001)
      .name("Wave 1 Frequency")
      .onChange(() => this.updateShaderUniforms());
    waveFolder
      .add(this.settings, "waveAmplitude1", 0, 15, 0.1)
      .name("Wave 1 Amplitude")
      .onChange(() => this.updateShaderUniforms());
    waveFolder
      .add(this.settings, "waveSpeed1", 0, 2, 0.01)
      .name("Wave 1 Speed")
      .onChange(() => this.updateShaderUniforms());
    waveFolder
      .add(this.settings, "waveFrequency2", 0.01, 0.3, 0.001)
      .name("Wave 2 Frequency")
      .onChange(() => this.updateShaderUniforms());
    waveFolder
      .add(this.settings, "waveAmplitude2", 0, 10, 0.1)
      .name("Wave 2 Amplitude")
      .onChange(() => this.updateShaderUniforms());
    waveFolder
      .add(this.settings, "waveSpeed2", 0, 2, 0.01)
      .name("Wave 2 Speed")
      .onChange(() => this.updateShaderUniforms());

    // Noise Parameters Folder
    const noiseFolder = this.gui.addFolder("🔮 Noise Turbulence");
    noiseFolder
      .add(this.settings, "noiseScale1", 0.01, 0.2, 0.001)
      .name("Noise 1 Scale")
      .onChange(() => this.updateShaderUniforms());
    noiseFolder
      .add(this.settings, "noiseAmplitude1", 0, 10, 0.1)
      .name("Noise 1 Amplitude")
      .onChange(() => this.updateShaderUniforms());
    noiseFolder
      .add(this.settings, "noiseSpeed1", 0, 1, 0.01)
      .name("Noise 1 Speed")
      .onChange(() => this.updateShaderUniforms());
    noiseFolder
      .add(this.settings, "noiseScale2", 0.01, 0.3, 0.001)
      .name("Noise 2 Scale")
      .onChange(() => this.updateShaderUniforms());
    noiseFolder
      .add(this.settings, "noiseAmplitude2", 0, 5, 0.1)
      .name("Noise 2 Amplitude")
      .onChange(() => this.updateShaderUniforms());
    noiseFolder
      .add(this.settings, "noiseSpeed2", 0, 1, 0.01)
      .name("Noise 2 Speed")
      .onChange(() => this.updateShaderUniforms());

    // Density Folder
    const densityFolder = this.gui.addFolder("💨 Density & Alpha");
    densityFolder
      .add(this.settings, "densityMin", -10, 0, 0.1)
      .name("Density Min")
      .onChange(() => this.updateShaderUniforms());
    densityFolder
      .add(this.settings, "densityMax", 0, 15, 0.1)
      .name("Density Max")
      .onChange(() => this.updateShaderUniforms());
    densityFolder
      .add(this.settings, "densityAlphaMin", 0, 1, 0.01)
      .name("Alpha Min")
      .onChange(() => this.updateShaderUniforms());
    densityFolder
      .add(this.settings, "densityAlphaMax", 0, 1, 0.01)
      .name("Alpha Max")
      .onChange(() => this.updateShaderUniforms());
    densityFolder
      .add(this.settings, "densitySizeBoost", 0, 2, 0.01)
      .name("Size Boost")
      .onChange(() => this.updateShaderUniforms());

    // Color Palette Folder
    const colorFolder = this.gui.addFolder("🎨 Color Gradient");
    colorFolder
      .addColor(this.settings, "color1")
      .name("Color 1 (Deep Blue)")
      .onChange(() => this.updateColors());
    colorFolder
      .addColor(this.settings, "color2")
      .name("Color 2 (Violet)")
      .onChange(() => this.updateColors());
    colorFolder
      .addColor(this.settings, "color3")
      .name("Color 3 (Magenta)")
      .onChange(() => this.updateColors());
    colorFolder
      .addColor(this.settings, "color4")
      .name("Color 4 (Crimson)")
      .onChange(() => this.updateColors());

    // Mouse Interaction Folder
    const mouseFolder = this.gui.addFolder("🖱️ Mouse Interaction");
    mouseFolder
      .add(this.settings, "mouseInteractionEnabled")
      .name("Enable Mouse")
      .onChange((value) => {
        if (this.app.mouseInteraction) {
          this.app.mouseInteraction.isMouseActive = value;
        }
      });
    mouseFolder
      .add(this.settings, "mouseRadius", 1, 30, 0.1)
      .name("Interaction Radius")
      .onChange((value) => this.updateMouseParams(value, null));
    mouseFolder
      .add(this.settings, "mouseStrength", 0, 20, 0.1)
      .name("Interaction Strength")
      .onChange((value) => this.updateMouseParams(null, value));

    // Post-Processing Folder
    const postFolder = this.gui.addFolder("✨ Post-Processing");
    postFolder
      .add(this.settings, "bloomStrength", 0, 5, 0.1)
      .name("Bloom Strength")
      .onChange((value) => this.updateBloom(value, null, null));
    postFolder
      .add(this.settings, "bloomRadius", 0, 2, 0.01)
      .name("Bloom Radius")
      .onChange((value) => this.updateBloom(null, value, null));
    postFolder
      .add(this.settings, "bloomThreshold", 0, 1, 0.01)
      .name("Bloom Threshold")
      .onChange((value) => this.updateBloom(null, null, value));
    postFolder
      .add(this.settings, "motionBlur", 0, 0.99, 0.01)
      .name("Motion Blur")
      .onChange((value) => this.updateMotionBlur(value));
    postFolder.open();

    // Camera Folder
    const cameraFolder = this.gui.addFolder("📷 Camera & Rotation");
    cameraFolder
      .add(this.settings, "cameraX", -50, 50, 1)
      .name("Camera X")
      .onChange(() => this.updateCamera());
    cameraFolder
      .add(this.settings, "cameraY", -50, 50, 1)
      .name("Camera Y")
      .onChange(() => this.updateCamera());
    cameraFolder
      .add(this.settings, "cameraZ", 5, 80, 1)
      .name("Camera Z")
      .onChange(() => this.updateCamera());
    cameraFolder
      .add(this.settings, "rotationX", -Math.PI, Math.PI, 0.01)
      .name("Rotation X")
      .onChange(() => this.updateRotation());
    cameraFolder
      .add(this.settings, "rotationY", -Math.PI, Math.PI, 0.01)
      .name("Rotation Y")
      .onChange(() => this.updateRotation());

    // Actions Folder
    const actionsFolder = this.gui.addFolder("🎮 Actions");
    actionsFolder.add(this.settings, "resetCamera").name("Reset Camera");
    actionsFolder.add(this.settings, "resetAll").name("Reset All Settings");
    actionsFolder.add(this.settings, "exportSettings").name("Export JSON");
    actionsFolder.add(this.settings, "toggleInfo").name("Toggle UI (H)");
    actionsFolder.open();

    // Close some folders by default to reduce clutter
    waveFolder.close();
    noiseFolder.close();
    densityFolder.close();
    colorFolder.close();
    mouseFolder.close();
    cameraFolder.close();

    console.log("✅ Settings panel created");
  }

  /**
   * Update particle size
   */
  updateParticleSize(value) {
    if (this.app.particleSystem) {
      this.app.particleSystem.setParticleSize(value);
    }
  }

  /**
   * Toggle curl noise mode
   */
  toggleCurlNoise(value) {
    if (this.app.particleSystem) {
      this.app.particleSystem.setUseCurlNoise(value);
      console.log("🌊 Curl Noise:", value ? "ENABLED" : "DISABLED");
    }
  }

  /**
   * Update curl strength
   */
  updateCurlStrength(value) {
    if (this.app.particleSystem) {
      this.app.particleSystem.setCurlStrength(value);
    }
  }

  /**
   * Update noise scale
   */
  updateNoiseScale(value) {
    if (this.app.particleSystem) {
      this.app.particleSystem.setNoiseScale(value);
    }
  }

  /**
   * Update shader uniforms (requires shader modification to support dynamic params)
   */
  updateShaderUniforms() {
    if (this.app.particleSystem && this.app.particleSystem.material.uniforms) {
      const uniforms = this.app.particleSystem.material.uniforms;

      // Wave parameters
      if (uniforms.uWaveFreq1)
        uniforms.uWaveFreq1.value = this.settings.waveFrequency1;
      if (uniforms.uWaveAmp1)
        uniforms.uWaveAmp1.value = this.settings.waveAmplitude1;
      if (uniforms.uWaveSpeed1)
        uniforms.uWaveSpeed1.value = this.settings.waveSpeed1;
      if (uniforms.uWaveFreq2)
        uniforms.uWaveFreq2.value = this.settings.waveFrequency2;
      if (uniforms.uWaveAmp2)
        uniforms.uWaveAmp2.value = this.settings.waveAmplitude2;
      if (uniforms.uWaveSpeed2)
        uniforms.uWaveSpeed2.value = this.settings.waveSpeed2;

      // Noise parameters
      if (uniforms.uNoiseScale1)
        uniforms.uNoiseScale1.value = this.settings.noiseScale1;
      if (uniforms.uNoiseAmp1)
        uniforms.uNoiseAmp1.value = this.settings.noiseAmplitude1;
      if (uniforms.uNoiseSpeed1)
        uniforms.uNoiseSpeed1.value = this.settings.noiseSpeed1;
      if (uniforms.uNoiseScale2)
        uniforms.uNoiseScale2.value = this.settings.noiseScale2;
      if (uniforms.uNoiseAmp2)
        uniforms.uNoiseAmp2.value = this.settings.noiseAmplitude2;
      if (uniforms.uNoiseSpeed2)
        uniforms.uNoiseSpeed2.value = this.settings.noiseSpeed2;

      // Density parameters
      if (uniforms.uDensityMin)
        uniforms.uDensityMin.value = this.settings.densityMin;
      if (uniforms.uDensityMax)
        uniforms.uDensityMax.value = this.settings.densityMax;
      if (uniforms.uDensityAlphaMin)
        uniforms.uDensityAlphaMin.value = this.settings.densityAlphaMin;
      if (uniforms.uDensityAlphaMax)
        uniforms.uDensityAlphaMax.value = this.settings.densityAlphaMax;
      if (uniforms.uDensitySizeBoost)
        uniforms.uDensitySizeBoost.value = this.settings.densitySizeBoost;
    }
  }

  /**
   * Update color uniforms
   */
  updateColors() {
    if (this.app.particleSystem && this.app.particleSystem.material.uniforms) {
      const uniforms = this.app.particleSystem.material.uniforms;

      if (uniforms.uColor1) {
        uniforms.uColor1.value.set(
          this.settings.color1.r / 255,
          this.settings.color1.g / 255,
          this.settings.color1.b / 255,
        );
      }
      if (uniforms.uColor2) {
        uniforms.uColor2.value.set(
          this.settings.color2.r / 255,
          this.settings.color2.g / 255,
          this.settings.color2.b / 255,
        );
      }
      if (uniforms.uColor3) {
        uniforms.uColor3.value.set(
          this.settings.color3.r / 255,
          this.settings.color3.g / 255,
          this.settings.color3.b / 255,
        );
      }
      if (uniforms.uColor4) {
        uniforms.uColor4.value.set(
          this.settings.color4.r / 255,
          this.settings.color4.g / 255,
          this.settings.color4.b / 255,
        );
      }
    }
  }

  /**
   * Update mouse interaction parameters
   */
  updateMouseParams(radius, strength) {
    if (this.app.particleSystem && this.app.particleSystem.material.uniforms) {
      if (
        radius !== null &&
        this.app.particleSystem.material.uniforms.uInteractionRadius
      ) {
        this.app.particleSystem.material.uniforms.uInteractionRadius.value =
          radius;
      }
      if (
        strength !== null &&
        this.app.particleSystem.material.uniforms.uInteractionStrength
      ) {
        this.app.particleSystem.material.uniforms.uInteractionStrength.value =
          strength;
      }
    }
  }

  /**
   * Update bloom pass parameters
   */
  updateBloom(strength, radius, threshold) {
    if (this.app.composer && this.app.composer.passes) {
      // Find UnrealBloomPass (usually index 1)
      const bloomPass = this.app.composer.passes.find(
        (pass) => pass.constructor.name === "UnrealBloomPass",
      );
      if (bloomPass) {
        if (strength !== null) bloomPass.strength = strength;
        if (radius !== null) bloomPass.radius = radius;
        if (threshold !== null) bloomPass.threshold = threshold;
      }
    }
  }

  /**
   * Update motion blur pass
   */
  updateMotionBlur(value) {
    if (this.app.composer && this.app.composer.passes) {
      const afterimagePass = this.app.composer.passes.find(
        (pass) => pass.constructor.name === "AfterimagePass",
      );
      if (afterimagePass) {
        afterimagePass.uniforms.damp.value = value;
      }
    }
  }

  /**
   * Update camera position
   */
  updateCamera() {
    if (this.app.camera) {
      this.app.camera.position.set(
        this.settings.cameraX,
        this.settings.cameraY,
        this.settings.cameraZ,
      );
      this.app.camera.lookAt(0, 0, 0);
    }
  }

  /**
   * Update nebula rotation
   */
  updateRotation() {
    if (this.app.particleSystem) {
      const mesh = this.app.particleSystem.getMesh();
      mesh.rotation.x = this.settings.rotationX;
      mesh.rotation.y = this.settings.rotationY;
    }
  }

  /**
   * Reset camera to default position
   */
  resetCamera() {
    this.settings.cameraX = 15;
    this.settings.cameraY = 12;
    this.settings.cameraZ = 25;
    this.settings.rotationX = -Math.PI * 0.3;
    this.settings.rotationY = Math.PI * 0.15;
    this.updateCamera();
    this.updateRotation();
    this.gui.updateDisplay();
    console.log("📷 Camera reset to default");
  }

  /**
   * Reset all settings to defaults
   */
  resetAll() {
    const confirmReset = confirm(
      "Reset all settings to default values? This cannot be undone.",
    );
    if (confirmReset) {
      location.reload();
    }
  }

  /**
   * Export settings as JSON
   */
  exportSettings() {
    const json = JSON.stringify(this.settings, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nebula-settings.json";
    a.click();
    URL.revokeObjectURL(url);
    console.log("💾 Settings exported");
  }

  /**
   * Toggle info panels
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
   * Add keyboard shortcut to toggle GUI
   */
  addKeyboardShortcut() {
    window.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "g") {
        if (this.gui._hidden) {
          this.gui.show();
        } else {
          this.gui.hide();
        }
      }
    });
  }

  /**
   * Show the GUI
   */
  show() {
    this.gui.show();
  }

  /**
   * Hide the GUI
   */
  hide() {
    this.gui.hide();
  }

  /**
   * Destroy the GUI
   */
  dispose() {
    this.gui.destroy();
  }
}

export default SettingsPanel;
