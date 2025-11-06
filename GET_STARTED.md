# 🚀 Get Started with Curl Noise Particle Animation

Welcome! This guide will get you up and running with the curl noise particle animation in **under 2 minutes**.

---

## ⚡ Quick Start (2 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Server
```bash
npm run dev
```

### Step 3: Open Demo
Visit: **http://localhost:5173/curl-particles.html**

**That's it!** You should now see 100,000 particles flowing with beautiful curl noise.

---

## 🎯 What You Just Launched

A GPU-accelerated particle system featuring:
- ✨ **100,000 particles** (configurable up to millions)
- 🌊 **Curl noise** for fluid-like, swirling motion
- 📸 **Bokeh effect** (depth of field blur)
- 🎨 **Real-time controls** via sliders
- 🚀 **60 FPS** on modern hardware

---

## 📂 Available Demos

| File | Description | Best For |
|------|-------------|----------|
| **curl-particles.html** | Full-featured curl noise demo | Production use, customization |
| **example-integration.html** | Content overlay example | Learning integration |
| **index.html** | Original wave animation | Wave/ripple effects |

---

## 🎮 Playing with Controls

Once the demo is running, use the **right panel** to adjust:

1. **Point Size** → Make particles bigger/smaller
2. **Noise Scale** → Change pattern density
3. **Flow Speed** → Speed up/slow down animation
4. **Curl Strength** → Adjust swirl intensity
5. **Colors** → Pick custom gradient colors

**Pro Tip**: Start by adjusting "Curl Strength" to 4.5 for aggressive swirls!

---

## 💻 Using in Your Project

### Basic Usage
```javascript
import { CurlNoiseParticles } from './src/CurlNoiseParticles.js';

const particles = new CurlNoiseParticles({
    particleCount: 100000,
    enableBokeh: true,
    color1: 0x0066ff,  // Blue
    color2: 0xff00ff,  // Pink
});
```

### Custom Configuration
```javascript
const particles = new CurlNoiseParticles({
    particleCount: 150000,      // More particles
    pointSize: 3.5,             // Bigger particles
    curlStrength: 4.0,          // Stronger swirls
    noiseSpeed: 0.8,            // Faster animation
    color1: 0xff0000,           // Red
    color2: 0x00ff00,           // Green
});
```

### Update in Real-Time
```javascript
particles.updateConfig({
    curlStrength: 3.5,
    pointSize: 4.0,
});
```

### Clean Up
```javascript
particles.dispose();
```

---

## 🎨 Quick Presets

### Subtle & Slow
```javascript
new CurlNoiseParticles({
    particleCount: 50000,
    pointSize: 1.5,
    noiseSpeed: 0.1,
    curlStrength: 1.5,
});
```

### Aggressive & Fast
```javascript
new CurlNoiseParticles({
    particleCount: 150000,
    pointSize: 3.5,
    noiseSpeed: 0.8,
    curlStrength: 4.5,
});
```

### Mobile-Friendly
```javascript
new CurlNoiseParticles({
    particleCount: 30000,
    enableBokeh: false,
    pointSize: 2.0,
});
```

---

## 📱 Mobile Optimization

Automatically adjust for mobile devices:

```javascript
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const particles = new CurlNoiseParticles({
    particleCount: isMobile ? 30000 : 100000,
    enableBokeh: !isMobile,
    pointSize: isMobile ? 2.0 : 2.5,
});
```

---

## 🐛 Troubleshooting

### Particles Not Visible?
- ✅ Check browser console for errors (F12)
- ✅ Ensure you're using `npm run dev` (not opening HTML directly)
- ✅ Try reducing `particleCount` to 1000 to test

### Low FPS / Laggy?
- ✅ Reduce particle count: `particleCount: 30000`
- ✅ Disable Bokeh: `enableBokeh: false`
- ✅ Lower resolution: `renderer.setPixelRatio(1)`

### Black Screen?
- ✅ Use a modern browser (Chrome, Firefox, Safari)
- ✅ Check that Three.js is installed: `npm install`
- ✅ Restart dev server: `npm run dev`

---

## 📚 Next Steps

### For Beginners
1. ✅ Run the demo (`curl-particles.html`)
2. ✅ Play with the sliders
3. ✅ Try different color combinations
4. ✅ Read `QUICKSTART.md` for more examples

### For Developers
1. ✅ Read `CURL_NOISE_README.md` for deep dive
2. ✅ Study `src/CurlNoiseParticles.js` source code
3. ✅ Check `example-integration.html` for integration
4. ✅ Explore GLSL shader code

### For Advanced Users
1. ✅ Read about GPGPU in `CURL_NOISE_README.md`
2. ✅ Add mouse interaction (examples provided)
3. ✅ Implement particle physics
4. ✅ Scale to millions of particles

---

## 📖 Documentation Guide

| File | Purpose | Read If... |
|------|---------|------------|
| **GET_STARTED.md** | This file | You're just starting |
| **QUICKSTART.md** | Quick examples | You want fast results |
| **CURL_NOISE_README.md** | Full documentation | You want deep understanding |
| **IMPLEMENTATION_SUMMARY.md** | Technical overview | You're a developer |
| **COMPARISON.md** | Original vs Curl Noise | You want to choose |

---

## 🎓 What is Curl Noise?

**Simple Explanation:**
- Regular noise → particles move randomly (clumping/dispersion)
- Curl noise → particles swirl smoothly (fluid-like motion)

**Technical Explanation:**
Curl noise uses the curl operator (∇ × F) from vector calculus to create a divergence-free vector field. This ensures particles flow in swirling patterns without clustering or separating unnaturally.

**Visual Analogy:**
- Regular noise = Wind blowing randomly
- Curl noise = Water flowing with eddies and vortices

---

## 💡 Common Use Cases

✨ **Background Effects**
- Website hero sections
- Landing pages
- Loading screens

✨ **Data Visualization**
- Scientific simulations
- Fluid dynamics
- Turbulence studies

✨ **Art & Creative**
- Abstract animations
- Music visualizers
- Digital installations

✨ **Games**
- Smoke effects
- Magic spells
- Atmospheric effects

---

## 🔗 Quick Links

- **Demo**: http://localhost:5173/curl-particles.html (after `npm run dev`)
- **Source**: `src/CurlNoiseParticles.js`
- **Full Docs**: `CURL_NOISE_README.md`
- **Three.js**: https://threejs.org/docs/

---

## 🌟 Key Features

| Feature | Description |
|---------|-------------|
| **GPU Accelerated** | All calculations on GPU via GLSL shaders |
| **Curl Noise** | Mathematical curl of 3D noise field |
| **Bokeh Effect** | Depth of field blur for cinematic look |
| **Real-time Config** | Adjust parameters while animation runs |
| **Responsive** | Automatically adapts to window resize |
| **Framework-Agnostic** | Works with React, Vue, vanilla JS |

---

## 🎉 You're Ready!

You now have everything you need to create stunning particle animations with curl noise.

**Start experimenting and have fun!** 🚀✨

---

## 💬 Questions?

Common questions:

**Q: Can I use this commercially?**
A: Yes! MIT licensed.

**Q: How many particles can I add?**
A: 100k-200k on most hardware. Up to millions with GPGPU.

**Q: Can particles interact with the mouse?**
A: Not by default, but examples are in `CURL_NOISE_README.md`.

**Q: Does this work on mobile?**
A: Yes! Use mobile optimization settings (see above).

**Q: Can I change the colors?**
A: Yes! Use the color pickers in the UI or `updateConfig()`.

---

**Happy coding!** If you create something cool, share it! 🎨