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
// Source: https://github.com/ashima/webgl-noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  // Permutations
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  // Gradients
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

  // Normalize gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix contributions
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec3 pos = position;

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
