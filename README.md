# 🌊 Three.js Particle Wave Animation

A stunning, high-performance particle wave animation built with Three.js and custom GLSL shaders. This project combines the best practices from multiple implementation approaches to create a production-ready, visually impressive particle system.

![Particle Wave Animation](https://img.shields.io/badge/Three.js-v0.168-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **60,000+ Dynamic Particles** - Flowing wave simulation with organic motion
- **Custom GLSL Shaders** - Optimized vertex and fragment shaders for maximum performance
- **Post-Processing Effects** - UnrealBloomPass for beautiful glowing particles
- **Performance Monitoring** - Real-time FPS, memory usage, and frame time tracking
- **Responsive Design** - Automatically adapts to device capabilities
- **Multiple Presets** - Pre-configured wave styles (Gentle, Turbulent, Calm, etc.)
- **Keyboard Shortcuts** - Quick controls for debugging and interaction
- **Mobile Optimized** - Adaptive particle count based on device performance

## 🎯 Visual Effects

- **Undulating Wave Motion** - Multiple sine wave layers with Simplex noise
- **Height-Based Color Gradient** - Deep blue → Purple → Pink transitions
- **Depth-Based Density** - Thicker particles in valleys, sparser on peaks
- **Soft Glowing Particles** - Additive blending with bloom post-processing
- **Smooth Animations** - 60 FPS target with performance optimization

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Modern browser with WebGL 2.0 support

### Installation

```bash
# Clone or navigate to the project directory
cd threejsparticleanimation

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will automatically open in your browser at `http://localhost:3000`

### Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
threejsparticleanimation/
├── index.html              # Main HTML entry point
├── package.json            # Project dependencies
├── vite.config.js          # Vite configuration with GLSL plugin
├── src/
│   ├── main.js            # Main application class
│   ├── ParticleSystem.js  # Particle system implementation
│   └── utils/
│       ├── PerformanceMonitor.js  # FPS and memory tracking
│       └── presets.js             # Wave configuration presets
├── shaders/
│   ├── particle.vert      # Vertex shader (wave calculations)
│   └── particle.frag      # Fragment shader (particle rendering)
└── guides/
    ├── guidegrok.md       # Grok's implementation guide
    └── guidecalude.md     # Claude's comprehensive handbook
```

## 🎮 Controls & Shortcuts

| Key | Action |
|-----|--------|
| `P` | Log performance report to console |
| `R` | Reset animation to initial state |
| `F` | Toggle fullscreen mode |
| `H` | Hide/show info panels |

## 🎨 Configuration & Presets

### Available Presets

The project includes 8 pre-configured animation styles:

1. **DEFAULT** - Balanced waves with good performance
2. **GENTLE** - Calm, meditative rolling waves
3. **TURBULENT** - Dramatic, energetic storm effect
4. **CALM** - Subtle, peaceful shallow waves
5. **OCEAN** - Large, sweeping oceanic movements
6. **RIPPLE** - Concentric waves from center
7. **PERFORMANCE** - Optimized for lower-end devices
8. **ULTRA** - Maximum visual quality for high-end systems

### Using Presets

```javascript
import { getPreset } from './src/utils/presets.js';

// Load a preset
const config = getPreset('GENTLE');

// Create particle system with preset
const particleSystem = new ParticleSystem(config.particles);
```

### Custom Configuration

You can create custom wave configurations:

```javascript
const customConfig = {
  width: 60,              // Horizontal span
  depth: 40,              // Depth span
  resolutionX: 300,       // Particle density X-axis
  resolutionZ: 200,       // Particle density Z-axis
  particleSize: 80,       // Base particle size
  waveSpeed: 0.8,         // Animation speed
  waveFrequencyX: 0.08,   // Wave frequency X-axis
  waveFrequencyZ: 0.12,   // Wave frequency Z-axis
  waveAmplitude: 6.0      // Wave height
};
```

## 🔧 Technical Details

### Architecture

This project uses a **hybrid approach** combining:
- **Grok's Guide**: Direct shader implementation for performance
- **Claude's Guide**: Modular architecture and optimization strategies

### Key Technologies

- **Three.js** (v0.168.0) - 3D rendering engine
- **GLSL Shaders** - Custom vertex and fragment shaders
- **Vite** - Fast development and build tool
- **WebGL 2.0** - GPU-accelerated graphics

### Shader Pipeline

1. **Vertex Shader** (`particle.vert`)
   - Calculates wave height using multi-layer sine waves
   - Adds Simplex noise for organic variation
   - Computes height-based color gradients
   - Applies depth-based density falloff

2. **Fragment Shader** (`particle.frag`)
   - Renders soft circular particles
   - Creates glowing core effect
   - Applies alpha blending for transparency

### Performance Optimizations

- ✅ GPU-accelerated shader calculations
- ✅ Additive blending with depth write disabled
- ✅ Adaptive particle count based on device
- ✅ Pixel ratio capped at 2x for high DPI displays
- ✅ Frustum culling disabled for seamless edges
- ✅ Performance monitoring with low FPS warnings

## 📊 Performance Targets

| Metric | Target | Mobile |
|--------|--------|--------|
| FPS | 60 | 30+ |
| Particle Count | 60,000 | 30,000 |
| Memory Usage | < 200MB | < 150MB |
| GPU Utilization | < 70% | < 60% |

## 🎓 Learning Resources

### Understanding the Code

1. **Wave Mathematics**
   - Study `shaders/particle.vert` for wave equations
   - Multi-layer sine waves create organic motion
   - Simplex noise adds natural variation

2. **Shader Programming**
   - GLSL syntax and built-in functions
   - Uniform vs. Attribute variables
   - Vertex transformation pipeline

3. **Three.js Concepts**
   - BufferGeometry for efficient particle storage
   - ShaderMaterial for custom shaders
   - EffectComposer for post-processing

### Recommended Reading

- [Three.js Documentation](https://threejs.org/docs/)
- [The Book of Shaders](https://thebookofshaders.com/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- Both included guides: `guidegrok.md` and `guidecalude.md`

## 🛠️ Customization Guide

### Modifying Wave Behavior

Edit the vertex shader (`shaders/particle.vert`):

```glsl
// Adjust wave parameters
float speed = 0.8;      // Animation speed
float freqX = 0.08;     // Wave frequency X
float freqZ = 0.12;     // Wave frequency Z
float amp = 6.0;        // Wave amplitude
```

### Changing Color Palette

Modify color gradients in the vertex shader:

```glsl
vec3 colorLow = vec3(0.1, 0.0, 0.3);    // Deep blue
vec3 colorMid = vec3(0.5, 0.1, 0.6);    // Purple
vec3 colorHigh = vec3(1.0, 0.3, 0.7);   // Pink
```

### Adjusting Bloom Effect

Edit `main.js` bloom pass configuration:

```javascript
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(width, height),
  1.6,   // Strength (0-3)
  0.6,   // Radius (0-1)
  0.1    // Threshold (0-1)
);
```

## 🐛 Troubleshooting

### Performance Issues

**Problem**: Low FPS or stuttering

**Solutions**:
- Reduce particle count in config
- Disable post-processing: `enablePostProcessing: false`
- Lower pixel ratio: `renderer.setPixelRatio(1)`
- Use PERFORMANCE preset

### Visual Issues

**Problem**: Particles appear as squares

**Solution**: Check that fragment shader is loaded correctly and `smoothstep` is working

**Problem**: No bloom/glow effect

**Solution**: Ensure post-processing is enabled and UnrealBloomPass is added to composer

### Browser Compatibility

**Problem**: Blank screen on Safari

**Solution**: Update to Safari 15+ or use Chrome/Firefox

**Problem**: Mobile performance issues

**Solution**: The app should auto-detect and reduce particle count. If not, manually use PERFORMANCE preset.

## 🚧 Roadmap & Future Enhancements

- [ ] **Mouse Interaction** - Particles react to cursor movement
- [ ] **Audio Reactivity** - Waves respond to music/microphone input
- [ ] **VR Support** - Immersive particle experience
- [ ] **Particle Trails** - Motion blur effect for particles
- [ ] **Dynamic Spawning** - Add/remove particle clusters
- [ ] **Parameter GUI** - Real-time control panel (dat.gui/lil-gui)
- [ ] **Export Animation** - Save as video or GIF
- [ ] **Multiple Scenes** - Switch between different wave types

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs or issues
- Suggest new features or presets
- Submit pull requests with improvements
- Share your custom configurations

## 📄 License

MIT License - Feel free to use this project for learning, personal, or commercial purposes.

## 🙏 Acknowledgments

This project combines insights from:
- **Grok's Guide** - Direct shader implementation approach
- **Claude's Guide** - Comprehensive architecture and optimization strategies
- **Three.js Community** - Excellent documentation and examples
- **Ashima Webgl Noise** - Simplex noise implementation

## 📞 Support

- **Documentation**: Check both guides in the project
- **Performance**: Press `P` to see detailed performance metrics
- **Console**: Check browser console for detailed logs and warnings

---

**Built with ❤️ using Three.js and GLSL**

*Happy coding! Create amazing particle animations!* 🎨✨