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
