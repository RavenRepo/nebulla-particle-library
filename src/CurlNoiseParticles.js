import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";

/**
 * CurlNoiseParticles - Advanced particle system with curl noise animation
 * Implements GPU-accelerated particle animation with curl noise for fluid-like motion
 */
export class CurlNoiseParticles {
  constructor(config = {}) {
    console.log("🌊 Initializing CurlNoiseParticles...");

    // Configuration
    this.config = {
      particleCount: config.particleCount || 100000,
      containerElement: config.containerElement || document.body,
      enableBokeh: config.enableBokeh !== false,
      colors: {
        color1: config.color1 || 0x0066ff,
        color2: config.color2 || 0xff00ff,
      },
      pointSize: config.pointSize || 2.5,
      noiseScale: config.noiseScale || 0.15,
      noiseSpeed: config.noiseSpeed || 0.3,
      curlStrength: config.curlStrength || 2.5,
      bokehFocus: config.bokehFocus || 5.0,
      bokehAperture: config.bokehAperture || 0.008,
      bokehMaxBlur: config.bokehMaxBlur || 0.015,
    };

    // Core Three.js components
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.composer = null;
    this.particles = null;
    this.material = null;
    this.geometry = null;
    this.clock = new THREE.Clock();

    // Animation state
    this.isAnimating = false;
    this.animationFrameId = null;

    try {
      this.init();
      console.log("✅ CurlNoiseParticles initialized successfully!");
    } catch (error) {
      console.error("❌ Failed to initialize CurlNoiseParticles:", error);
      throw error;
    }
  }

  /**
   * Initialize the particle system
   */
  init() {
    console.log("Step 1: Creating renderer...");
    this.createRenderer();

    console.log("Step 2: Creating scene...");
    this.createScene();

    console.log("Step 3: Creating camera...");
    this.createCamera();

    console.log("Step 4: Creating particles...");
    this.createParticles();

    if (this.config.enableBokeh) {
      console.log("Step 5: Creating post-processing...");
      this.createPostProcessing();
    }

    console.log("Step 6: Setting up event listeners...");
    this.setupEventListeners();

    console.log("Step 7: Starting animation...");
    this.start();
  }

  /**
   * Create WebGL renderer
   */
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 1);

    this.config.containerElement.appendChild(this.renderer.domElement);
    console.log("✓ Renderer created");
  }

  /**
   * Create scene
   */
  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    console.log("✓ Scene created");
  }

  /**
   * Create camera
   */
  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.camera.position.set(0, 0, 8);
    this.camera.lookAt(0, 0, 0);
    console.log("✓ Camera created at position:", this.camera.position);
  }

  /**
   * Create particle geometry
   */
  createParticles() {
    const particleCount = this.config.particleCount;
    const positions = new Float32Array(particleCount * 3);

    // Initialize particles in a volume
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = (Math.random() - 0.5) * 15; // x
      positions[i3 + 1] = (Math.random() - 0.5) * 15; // y
      positions[i3 + 2] = (Math.random() - 0.5) * 15; // z
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    console.log("✓ Geometry created with", particleCount, "particles");

    // Create shader material
    console.log("Creating shader material...");
    this.material = this.createShaderMaterial();

    // Create points
    this.particles = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.particles);

    console.log("✓ Particles added to scene");
    console.log("✓ Particle system visible:", this.particles.visible);
  }

  /**
   * Create custom shader material with curl noise
   */
  createShaderMaterial() {
    const vertexShader = `
            uniform float uTime;
            uniform float uPointSize;
            uniform float uNoiseScale;
            uniform float uNoiseSpeed;
            uniform float uCurlStrength;

            varying vec3 vPosition;
            varying float vNoise;

            // GLSL 3D Simplex Noise
            vec3 mod289(vec3 x) {
                return x - floor(x * (1.0 / 289.0)) * 289.0;
            }

            vec4 mod289(vec4 x) {
                return x - floor(x * (1.0 / 289.0)) * 289.0;
            }

            vec4 permute(vec4 x) {
                return mod289(((x * 34.0) + 1.0) * x);
            }

            vec4 taylorInvSqrt(vec4 r) {
                return 1.79284291400159 - 0.85373472095314 * r;
            }

            float snoise(vec3 v) {
                const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
                const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

                vec3 i  = floor(v + dot(v, C.yyy));
                vec3 x0 = v - i + dot(i, C.xxx);

                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min(g.xyz, l.zxy);
                vec3 i2 = max(g.xyz, l.zxy);

                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy;
                vec3 x3 = x0 - D.yyy;

                i = mod289(i);
                vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

                float n_ = 0.142857142857;
                vec3 ns = n_ * D.wyz - D.xzx;

                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_);

                vec4 x = x_ * ns.x + ns.yyyy;
                vec4 y = y_ * ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);

                vec4 b0 = vec4(x.xy, y.xy);
                vec4 b1 = vec4(x.zw, y.zw);

                vec4 s0 = floor(b0) * 2.0 + 1.0;
                vec4 s1 = floor(b1) * 2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));

                vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
                vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

                vec3 p0 = vec3(a0.xy, h.x);
                vec3 p1 = vec3(a0.zw, h.y);
                vec3 p2 = vec3(a1.xy, h.z);
                vec3 p3 = vec3(a1.zw, h.w);

                vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;

                vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
                m = m * m;
                return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
            }

            // Curl Noise
            vec3 curlNoise(vec3 p) {
                const float e = 0.1;
                float n1, n2, a, b;

                // Curl X
                n1 = snoise(vec3(p.x, p.y + e, p.z));
                n2 = snoise(vec3(p.x, p.y - e, p.z));
                a = (n1 - n2) / (2.0 * e);

                n1 = snoise(vec3(p.x, p.y, p.z + e));
                n2 = snoise(vec3(p.x, p.y, p.z - e));
                b = (n1 - n2) / (2.0 * e);
                float curlX = a - b;

                // Curl Y
                n1 = snoise(vec3(p.x, p.y, p.z + e));
                n2 = snoise(vec3(p.x, p.y, p.z - e));
                a = (n1 - n2) / (2.0 * e);

                n1 = snoise(vec3(p.x + e, p.y, p.z));
                n2 = snoise(vec3(p.x - e, p.y, p.z));
                b = (n1 - n2) / (2.0 * e);
                float curlY = a - b;

                // Curl Z
                n1 = snoise(vec3(p.x + e, p.y, p.z));
                n2 = snoise(vec3(p.x - e, p.y, p.z));
                a = (n1 - n2) / (2.0 * e);

                n1 = snoise(vec3(p.x, p.y + e, p.z));
                n2 = snoise(vec3(p.x, p.y - e, p.z));
                b = (n1 - n2) / (2.0 * e);
                float curlZ = a - b;

                return vec3(curlX, curlY, curlZ);
            }

            void main() {
                vPosition = position;

                vec3 noisePos = position * uNoiseScale + uTime * uNoiseSpeed;
                vec3 curl = curlNoise(noisePos);
                vec3 newPosition = position + curl * uCurlStrength;

                vNoise = length(curl);

                vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                gl_PointSize = uPointSize * (300.0 / -mvPosition.z);
            }
        `;

    const fragmentShader = `
            uniform vec3 uColor1;
            uniform vec3 uColor2;

            varying vec3 vPosition;
            varying float vNoise;

            void main() {
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);

                if (dist > 0.5) {
                    discard;
                }

                float alpha = 1.0 - smoothstep(0.3, 0.5, dist);

                float gradient = (vPosition.y + 7.5) / 15.0;
                gradient = mix(gradient, vNoise, 0.3);
                vec3 color = mix(uColor1, uColor2, gradient);

                color += vNoise * 0.2;

                gl_FragColor = vec4(color, alpha);
            }
        `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uPointSize: { value: this.config.pointSize },
        uNoiseScale: { value: this.config.noiseScale },
        uNoiseSpeed: { value: this.config.noiseSpeed },
        uCurlStrength: { value: this.config.curlStrength },
        uColor1: { value: new THREE.Color(this.config.colors.color1) },
        uColor2: { value: new THREE.Color(this.config.colors.color2) },
      },
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    });

    console.log("✓ Shader material created");
    console.log("  - Point size:", this.config.pointSize);
    console.log("  - Curl strength:", this.config.curlStrength);

    return material;
  }

  /**
   * Create post-processing (Bokeh depth of field)
   */
  createPostProcessing() {
    try {
      this.composer = new EffectComposer(this.renderer);

      const renderPass = new RenderPass(this.scene, this.camera);
      this.composer.addPass(renderPass);

      const bokehPass = new BokehPass(this.scene, this.camera, {
        focus: this.config.bokehFocus,
        aperture: this.config.bokehAperture,
        maxblur: this.config.bokehMaxBlur,
      });
      this.composer.addPass(bokehPass);

      console.log("✓ Post-processing created (Bokeh enabled)");
    } catch (error) {
      console.warn("⚠️ Could not create post-processing:", error.message);
      console.warn("Continuing without Bokeh effect...");
      this.config.enableBokeh = false;
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    window.addEventListener("resize", () => this.onWindowResize());
    console.log("✓ Event listeners set up");
  }

  /**
   * Handle window resize
   */
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (this.composer) {
      this.composer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  /**
   * Animation loop
   */
  animate() {
    if (!this.isAnimating) return;

    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // Update shader uniforms
    if (this.material && this.material.uniforms) {
      this.material.uniforms.uTime.value = elapsedTime;
    }

    // Optional: Rotate particle system slowly
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.05;
    }

    // Render
    if (this.composer && this.config.enableBokeh) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  /**
   * Start animation
   */
  start() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.animate();
    console.log("✓ Animation started");
  }

  /**
   * Stop animation
   */
  stop() {
    this.isAnimating = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    console.log("Animation stopped");
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    if (!this.material || !this.material.uniforms) {
      console.warn("Cannot update config: material not ready");
      return;
    }

    if (newConfig.pointSize !== undefined) {
      this.config.pointSize = newConfig.pointSize;
      this.material.uniforms.uPointSize.value = newConfig.pointSize;
    }

    if (newConfig.noiseScale !== undefined) {
      this.config.noiseScale = newConfig.noiseScale;
      this.material.uniforms.uNoiseScale.value = newConfig.noiseScale;
    }

    if (newConfig.noiseSpeed !== undefined) {
      this.config.noiseSpeed = newConfig.noiseSpeed;
      this.material.uniforms.uNoiseSpeed.value = newConfig.noiseSpeed;
    }

    if (newConfig.curlStrength !== undefined) {
      this.config.curlStrength = newConfig.curlStrength;
      this.material.uniforms.uCurlStrength.value = newConfig.curlStrength;
    }

    if (newConfig.color1 !== undefined) {
      this.config.colors.color1 = newConfig.color1;
      this.material.uniforms.uColor1.value = new THREE.Color(newConfig.color1);
    }

    if (newConfig.color2 !== undefined) {
      this.config.colors.color2 = newConfig.color2;
      this.material.uniforms.uColor2.value = new THREE.Color(newConfig.color2);
    }
  }

  /**
   * Dispose of resources
   */
  dispose() {
    console.log("Disposing CurlNoiseParticles...");

    this.stop();

    if (this.geometry) {
      this.geometry.dispose();
    }

    if (this.material) {
      this.material.dispose();
    }

    if (
      this.renderer &&
      this.config.containerElement.contains(this.renderer.domElement)
    ) {
      this.config.containerElement.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }

    if (this.composer) {
      this.composer.dispose();
    }

    window.removeEventListener("resize", () => this.onWindowResize());

    console.log("✓ Resources disposed");
  }
}
