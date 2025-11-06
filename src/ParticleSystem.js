import * as THREE from "three";

// Temporarily inline shaders for testing
const vertexShader = `
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uMouse;
uniform float uMouseActive;
uniform float uInteractionRadius;
uniform float uInteractionStrength;

attribute float scale;
attribute vec2 offset;

varying vec2 vUv;
varying float vAlpha;
varying vec3 vColor;

// ===== SIMPLEX NOISE 3D =====
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
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

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// ===== CURL NOISE =====
vec3 curlNoise(vec3 p) {
  const float e = 0.1;
  float n1, n2, a, b;

  // Curl X component
  n1 = snoise(vec3(p.x, p.y + e, p.z));
  n2 = snoise(vec3(p.x, p.y - e, p.z));
  a = (n1 - n2) / (2.0 * e);

  n1 = snoise(vec3(p.x, p.y, p.z + e));
  n2 = snoise(vec3(p.x, p.y, p.z - e));
  b = (n1 - n2) / (2.0 * e);
  float curlX = a - b;

  // Curl Y component
  n1 = snoise(vec3(p.x, p.y, p.z + e));
  n2 = snoise(vec3(p.x, p.y, p.z - e));
  a = (n1 - n2) / (2.0 * e);

  n1 = snoise(vec3(p.x + e, p.y, p.z));
  n2 = snoise(vec3(p.x - e, p.y, p.z));
  b = (n1 - n2) / (2.0 * e);
  float curlY = a - b;

  // Curl Z component
  n1 = snoise(vec3(p.x + e, p.y, p.z));
  n2 = snoise(vec3(p.x - e, p.y, p.z));
  a = (n1 - n2) / (2.0 * e);

  n1 = snoise(vec3(p.x, p.y + e, p.z));
  n2 = snoise(vec3(p.x, p.y - e, p.z));
  b = (n1 - n2) / (2.0 * e);
  float curlZ = a - b;

  return vec3(curlX, curlY, curlZ);
}

uniform float uUseCurlNoise;
uniform float uCurlStrength;
uniform float uNoiseScale;

void main() {
  vec3 pos = position;

  // Choose between wave mode and curl noise mode
  if (uUseCurlNoise > 0.5) {
    // ===== CURL NOISE MODE =====
    vec3 noisePos = pos * uNoiseScale + uTime * 0.3;
    vec3 curl = curlNoise(noisePos);
    pos += curl * uCurlStrength;
  } else {
    // ===== DIAGONAL WAVE DISPLACEMENT =====
    // Precise implementation from visual breakdown
    float diag = pos.x * 0.7 - pos.z * 0.5;
    float wave = sin(diag * 0.07 - uTime * 0.7) * 5.5;
    float wave2 = sin(diag * 0.12 - uTime * 0.91) * 3.0;

    // ===== 3D SIMPLEX NOISE TURBULENCE (Multi-octave FBM) =====
    float n1 = snoise(vec3(pos.x * 0.04, pos.z * 0.04, uTime * 0.25)) * 4.0;
    float n2 = snoise(vec3(pos.x * 0.10, pos.z * 0.10, uTime * 0.40)) * 1.5;

    // ===== COMBINE DISPLACEMENT =====
    pos.y = wave + wave2 + n1 + n2;
  }

  // ===== MOUSE INTERACTION =====
  if (uMouseActive > 0.5) {
    // Calculate distance from mouse in XZ plane
    vec2 mouseXZ = uMouse.xz;
    vec2 particleXZ = pos.xz;
    float distToMouse = distance(particleXZ, mouseXZ);

    // Create displacement force that falls off with distance
    float influence = smoothstep(uInteractionRadius, 0.0, distToMouse);

    if (influence > 0.0) {
      // Push particles away from mouse (repulsion)
      vec2 direction = normalize(particleXZ - mouseXZ);
      float displacement = influence * uInteractionStrength;

      // Apply displacement to Y position (create a bump/wave)
      pos.y += displacement;

      // Optionally push particles outward in XZ plane too
      pos.x += direction.x * displacement * 0.3;
      pos.z += direction.y * displacement * 0.3;
    }
  }

  // ===== DENSITY-BASED ALPHA (Volumetric Clustering) =====
  // Higher density in valleys, inverse height mapping
  float density = smoothstep(-4.0, 6.0, -pos.y);
  vAlpha = density * 0.8 + 0.2; // Minimum alpha 0.2 to prevent total fade

  // ===== HEIGHT-DRIVEN COLOR GRADIENT (4-stop) =====
  // Map height to [0,1] range: [-6,6] → [0,1]
  float h = (pos.y + 6.0) / 12.0;
  h = clamp(h, 0.0, 1.0);

  // 4-color gradient matching reference nebula
  vec3 c1 = vec3(0.10, 0.15, 0.40); // Deep Blue
  vec3 c2 = vec3(0.50, 0.10, 0.70); // Violet
  vec3 c3 = vec3(1.00, 0.30, 0.80); // Magenta
  vec3 c4 = vec3(1.00, 0.40, 0.30); // Crimson

  // Smoothstep blending for no banding
  vColor = mix(c1, c2, smoothstep(0.0, 0.3, h));
  vColor = mix(vColor, c3, smoothstep(0.3, 0.7, h));
  vColor = mix(vColor, c4, smoothstep(0.7, 1.0, h));

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // ===== DYNAMIC POINT SIZE ATTENUATION =====
  // Perspective-correct scaling with density boost
  float pointSize = uSize * scale * uPixelRatio * (1.0 / -mvPosition.z);
  gl_PointSize = pointSize * (1.0 + density * 0.7); // Larger in dense areas
}
`;

const fragmentShader = `
varying vec2 vUv;
varying float vAlpha;
varying vec3 vColor;

void main() {
  // ===== SOFT PARTICLE FALLOFF =====
  // Gaussian-like via smoothstep + power curve
  float dist = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.0, dist);
  alpha = pow(alpha, 1.5); // Sharper core, softer edge
  alpha *= vAlpha;

  // ===== EMISSIVE GLOW BOOST =====
  // Inner core overbright → bloom source
  // Alpha-driven → brighter where dense
  vec3 color = vColor * (1.0 + alpha * 3.0);

  gl_FragColor = vec4(color, alpha);
}
`;

/**
 * ParticleSystem - Manages the particle wave geometry, material, and animations
 * Hybrid approach combining Grok's shader implementation with Claude's architecture
 */
export class ParticleSystem {
  constructor(config = {}) {
    // Configuration with defaults
    this.config = {
      width: config.width || 60,
      depth: config.depth || 40,
      resolutionX: config.resolutionX || 300,
      resolutionZ: config.resolutionZ || 200,
      particleSize: config.particleSize || 80,

      // Wave parameters (can be modified for different effects)
      waveSpeed: config.waveSpeed || 0.8,
      waveFrequencyX: config.waveFrequencyX || 0.08,
      waveFrequencyZ: config.waveFrequencyZ || 0.12,
      waveAmplitude: config.waveAmplitude || 6.0,

      // Curl noise parameters
      useCurlNoise: config.useCurlNoise || false,
      curlStrength: config.curlStrength || 2.5,
      noiseScale: config.noiseScale || 0.15,

      // Visual parameters
      minAlpha: config.minAlpha || 0.0,
      maxAlpha: config.maxAlpha || 1.0,

      ...config,
    };

    this.particleCount = this.config.resolutionX * this.config.resolutionZ;
    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.time = 0;

    this.init();
  }

  /**
   * Initialize the particle system
   */
  init() {
    this.createGeometry();
    this.createMaterial();
    this.createMesh();
  }

  /**
   * Create BufferGeometry with particle positions and attributes
   */
  createGeometry() {
    const { width, depth, resolutionX, resolutionZ } = this.config;

    this.geometry = new THREE.BufferGeometry();

    // Allocate arrays for all particle attributes
    const positions = new Float32Array(this.particleCount * 3);
    const scales = new Float32Array(this.particleCount);
    const offsets = new Float32Array(this.particleCount * 2);

    let idx = 0;

    // Generate particle grid
    for (let i = 0; i < resolutionX; i++) {
      for (let j = 0; j < resolutionZ; j++) {
        // Calculate normalized positions (0-1 range)
        const u = i / resolutionX;
        const v = j / resolutionZ;

        // Calculate world positions (centered around origin)
        const x = (u - 0.5) * width;
        const z = (v - 0.5) * depth;

        // Position (Y will be calculated in vertex shader based on waves)
        positions[idx * 3 + 0] = x;
        positions[idx * 3 + 1] = 0; // Initial Y position
        positions[idx * 3 + 2] = z;

        // Offsets for noise sampling in shader
        offsets[idx * 2 + 0] = x;
        offsets[idx * 2 + 1] = z;

        // Random scale variation for each particle (0.8 - 1.4)
        scales[idx] = 0.8 + Math.random() * 0.6;

        idx++;
      }
    }

    // Set attributes on geometry
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    this.geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
    this.geometry.setAttribute("offset", new THREE.BufferAttribute(offsets, 2));

    console.log(
      `✅ Particle geometry created: ${this.particleCount.toLocaleString()} particles`,
    );
  }

  /**
   * Create ShaderMaterial with custom vertex and fragment shaders
   */
  createMaterial() {
    console.log("🔍 Creating shader material...");
    console.log(
      "Vertex shader length:",
      vertexShader ? vertexShader.length : "UNDEFINED",
    );
    console.log(
      "Fragment shader length:",
      fragmentShader ? fragmentShader.length : "UNDEFINED",
    );

    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,

      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: this.config.particleSize },
        uMouse: { value: new THREE.Vector3(999, 999, 999) },
        uMouseActive: { value: 0.0 },
        uInteractionRadius: { value: 8.0 },
        uInteractionStrength: { value: 5.0 },
        uUseCurlNoise: { value: this.config.useCurlNoise ? 1.0 : 0.0 },
        uCurlStrength: { value: this.config.curlStrength },
        uNoiseScale: { value: this.config.noiseScale },
      },

      // Rendering properties for glowing particles
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      vertexColors: false,
    });

    // Check for shader compilation errors
    this.material.needsUpdate = true;

    console.log("✅ Shader material created");
    console.log("Material:", this.material);
  }

  /**
   * Create Points mesh from geometry and material
   */
  createMesh() {
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.mesh.frustumCulled = false; // Don't cull particles at screen edges
    console.log("✅ Particle mesh created");
  }

  /**
   * Update particle system (called every frame)
   * @param {number} deltaTime - Time elapsed since last frame
   * @param {THREE.Vector3} mousePosition - Mouse position in world space
   * @param {boolean} mouseActive - Is mouse interaction active
   */
  update(deltaTime, mousePosition = null, mouseActive = false) {
    this.time += deltaTime;

    // Update shader uniforms
    if (this.material && this.material.uniforms) {
      this.material.uniforms.uTime.value = this.time;

      // Update mouse interaction uniforms
      if (mousePosition) {
        this.material.uniforms.uMouse.value.copy(mousePosition);
      }
      this.material.uniforms.uMouseActive.value = mouseActive ? 1.0 : 0.0;
    }
  }

  /**
   * Update particle size
   * @param {number} size - New particle size
   */
  setParticleSize(size) {
    this.config.particleSize = size;
    if (this.material && this.material.uniforms) {
      this.material.uniforms.uSize.value = size;
    }
  }

  /**
   * Update pixel ratio (useful for responsive design)
   */
  updatePixelRatio() {
    if (this.material && this.material.uniforms) {
      this.material.uniforms.uPixelRatio.value = Math.min(
        window.devicePixelRatio,
        2,
      );
    }
  }

  /**
   * Get the Three.js mesh object
   * @returns {THREE.Points}
   */
  getMesh() {
    return this.mesh;
  }

  /**
   * Get particle count
   * @returns {number}
   */
  getParticleCount() {
    return this.particleCount;
  }

  /**
   * Get current configuration
   * @returns {Object}
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Dispose of resources (important for memory management)
   */
  dispose() {
    if (this.geometry) {
      this.geometry.dispose();
    }
    if (this.material) {
      this.material.dispose();
    }
    console.log("🗑️  Particle system disposed");
  }

  /**
   * Reset time (useful for restarting animation)
   */
  resetTime() {
    this.time = 0;
  }

  /**
   * Toggle between wave and curl noise modes
   * @param {boolean} useCurl - Whether to use curl noise
   */
  setUseCurlNoise(useCurl) {
    this.config.useCurlNoise = useCurl;
    if (this.material && this.material.uniforms) {
      this.material.uniforms.uUseCurlNoise.value = useCurl ? 1.0 : 0.0;
    }
  }

  /**
   * Update curl strength
   * @param {number} strength - Curl strength value
   */
  setCurlStrength(strength) {
    this.config.curlStrength = strength;
    if (this.material && this.material.uniforms) {
      this.material.uniforms.uCurlStrength.value = strength;
    }
  }

  /**
   * Update noise scale
   * @param {number} scale - Noise scale value
   */
  setNoiseScale(scale) {
    this.config.noiseScale = scale;
    if (this.material && this.material.uniforms) {
      this.material.uniforms.uNoiseScale.value = scale;
    }
  }
}

export default ParticleSystem;
