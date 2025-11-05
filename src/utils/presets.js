/**
 * Animation Presets - Different wave configurations for various visual effects
 * Inspired by Claude's guide configuration examples
 */

export const PRESETS = {
  // Default preset - Balanced waves with good performance
  DEFAULT: {
    name: 'Default Wave',
    particles: {
      resolutionX: 300,
      resolutionZ: 200,
      particleSize: 80
    },
    wave: {
      speed: 0.8,
      frequencyX: 0.08,
      frequencyZ: 0.12,
      amplitude: 6.0
    },
    camera: {
      x: 0,
      y: 8,
      z: 20
    },
    bloom: {
      strength: 1.6,
      radius: 0.6,
      threshold: 0.1
    }
  },

  // Gentle rolling waves - Calm, meditative effect
  GENTLE: {
    name: 'Gentle Rolling Waves',
    particles: {
      resolutionX: 250,
      resolutionZ: 180,
      particleSize: 70
    },
    wave: {
      speed: 0.4,
      frequencyX: 0.05,
      frequencyZ: 0.08,
      amplitude: 3.0
    },
    camera: {
      x: 0,
      y: 10,
      z: 25
    },
    bloom: {
      strength: 1.4,
      radius: 0.8,
      threshold: 0.15
    }
  },

  // Aggressive turbulent waves - Dramatic, energetic effect
  TURBULENT: {
    name: 'Turbulent Storm',
    particles: {
      resolutionX: 350,
      resolutionZ: 220,
      particleSize: 90
    },
    wave: {
      speed: 1.5,
      frequencyX: 0.15,
      frequencyZ: 0.18,
      amplitude: 10.0
    },
    camera: {
      x: 0,
      y: 12,
      z: 18
    },
    bloom: {
      strength: 2.0,
      radius: 0.4,
      threshold: 0.05
    }
  },

  // Shallow calm waves - Subtle, peaceful movement
  CALM: {
    name: 'Calm Shallow Waves',
    particles: {
      resolutionX: 200,
      resolutionZ: 150,
      particleSize: 60
    },
    wave: {
      speed: 0.3,
      frequencyX: 0.04,
      frequencyZ: 0.06,
      amplitude: 2.0
    },
    camera: {
      x: 0,
      y: 6,
      z: 22
    },
    bloom: {
      strength: 1.2,
      radius: 0.9,
      threshold: 0.2
    }
  },

  // Ocean waves - Large, sweeping movements
  OCEAN: {
    name: 'Ocean Waves',
    particles: {
      resolutionX: 320,
      resolutionZ: 200,
      particleSize: 85
    },
    wave: {
      speed: 0.6,
      frequencyX: 0.06,
      frequencyZ: 0.09,
      amplitude: 8.0
    },
    camera: {
      x: 0,
      y: 9,
      z: 24
    },
    bloom: {
      strength: 1.7,
      radius: 0.5,
      threshold: 0.12
    }
  },

  // Ripple effect - Concentric waves from center
  RIPPLE: {
    name: 'Ripple Effect',
    particles: {
      resolutionX: 280,
      resolutionZ: 180,
      particleSize: 75
    },
    wave: {
      speed: 1.0,
      frequencyX: 0.1,
      frequencyZ: 0.1,
      amplitude: 5.0
    },
    camera: {
      x: 0,
      y: 15,
      z: 15
    },
    bloom: {
      strength: 1.8,
      radius: 0.7,
      threshold: 0.08
    }
  },

  // High performance - Optimized for lower-end devices
  PERFORMANCE: {
    name: 'Performance Mode',
    particles: {
      resolutionX: 150,
      resolutionZ: 100,
      particleSize: 100
    },
    wave: {
      speed: 0.8,
      frequencyX: 0.08,
      frequencyZ: 0.12,
      amplitude: 6.0
    },
    camera: {
      x: 0,
      y: 8,
      z: 20
    },
    bloom: {
      strength: 1.5,
      radius: 0.6,
      threshold: 0.15
    }
  },

  // High quality - Maximum visual impact
  ULTRA: {
    name: 'Ultra Quality',
    particles: {
      resolutionX: 400,
      resolutionZ: 250,
      particleSize: 70
    },
    wave: {
      speed: 0.8,
      frequencyX: 0.08,
      frequencyZ: 0.12,
      amplitude: 6.0
    },
    camera: {
      x: 0,
      y: 8,
      z: 20
    },
    bloom: {
      strength: 1.9,
      radius: 0.5,
      threshold: 0.05
    }
  }
};

/**
 * Get preset by name
 * @param {string} name - Preset name (e.g., 'GENTLE', 'TURBULENT')
 * @returns {Object} Preset configuration
 */
export function getPreset(name) {
  const presetName = name.toUpperCase();
  if (PRESETS[presetName]) {
    return { ...PRESETS[presetName] };
  }
  console.warn(`Preset "${name}" not found, using DEFAULT`);
  return { ...PRESETS.DEFAULT };
}

/**
 * Get all preset names
 * @returns {string[]} Array of preset names
 */
export function getPresetNames() {
  return Object.keys(PRESETS);
}

/**
 * Create custom preset by merging with base preset
 * @param {string} baseName - Base preset name
 * @param {Object} overrides - Properties to override
 * @returns {Object} Custom preset configuration
 */
export function createCustomPreset(baseName, overrides = {}) {
  const base = getPreset(baseName);

  return {
    ...base,
    particles: { ...base.particles, ...(overrides.particles || {}) },
    wave: { ...base.wave, ...(overrides.wave || {}) },
    camera: { ...base.camera, ...(overrides.camera || {}) },
    bloom: { ...base.bloom, ...(overrides.bloom || {}) }
  };
}

/**
 * Interpolate between two presets
 * @param {string} preset1Name - First preset name
 * @param {string} preset2Name - Second preset name
 * @param {number} t - Interpolation factor (0-1)
 * @returns {Object} Interpolated preset
 */
export function interpolatePresets(preset1Name, preset2Name, t) {
  const p1 = getPreset(preset1Name);
  const p2 = getPreset(preset2Name);

  const lerp = (a, b, t) => a + (b - a) * t;

  return {
    name: `${p1.name} → ${p2.name}`,
    particles: {
      resolutionX: Math.round(lerp(p1.particles.resolutionX, p2.particles.resolutionX, t)),
      resolutionZ: Math.round(lerp(p1.particles.resolutionZ, p2.particles.resolutionZ, t)),
      particleSize: lerp(p1.particles.particleSize, p2.particles.particleSize, t)
    },
    wave: {
      speed: lerp(p1.wave.speed, p2.wave.speed, t),
      frequencyX: lerp(p1.wave.frequencyX, p2.wave.frequencyX, t),
      frequencyZ: lerp(p1.wave.frequencyZ, p2.wave.frequencyZ, t),
      amplitude: lerp(p1.wave.amplitude, p2.wave.amplitude, t)
    },
    camera: {
      x: lerp(p1.camera.x, p2.camera.x, t),
      y: lerp(p1.camera.y, p2.camera.y, t),
      z: lerp(p1.camera.z, p2.camera.z, t)
    },
    bloom: {
      strength: lerp(p1.bloom.strength, p2.bloom.strength, t),
      radius: lerp(p1.bloom.radius, p2.bloom.radius, t),
      threshold: lerp(p1.bloom.threshold, p2.bloom.threshold, t)
    }
  };
}

export default PRESETS;
