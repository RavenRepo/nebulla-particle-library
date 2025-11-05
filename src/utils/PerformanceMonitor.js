/**
 * PerformanceMonitor - Tracks FPS, frame times, and memory usage
 * Adapted from Claude's guide for real-time performance monitoring
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: [],
      particleUpdateTime: [],
      renderTime: [],
      memoryUsage: []
    };

    this.maxSamples = 60; // Keep last 60 samples
    this.frameStart = 0;
    this.particleUpdateStart = 0;
    this.renderStart = 0;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.fpsUpdateInterval = 500; // Update FPS display every 500ms
    this.lastFpsUpdate = 0;
    this.currentFps = 0;
  }

  /**
   * Mark the start of a frame
   */
  startFrame() {
    this.frameStart = performance.now();
  }

  /**
   * Mark the start of particle update
   */
  markParticleUpdateStart() {
    this.particleUpdateStart = performance.now();
  }

  /**
   * Mark the end of particle update
   */
  markParticleUpdateEnd() {
    const duration = performance.now() - this.particleUpdateStart;
    this.addMetric('particleUpdateTime', duration);
  }

  /**
   * Mark the start of render
   */
  markRenderStart() {
    this.renderStart = performance.now();
  }

  /**
   * Mark the end of render
   */
  markRenderEnd() {
    const duration = performance.now() - this.renderStart;
    this.addMetric('renderTime', duration);
  }

  /**
   * Mark the end of a frame and calculate FPS
   */
  endFrame() {
    const now = performance.now();
    const frameDuration = now - this.frameStart;
    const fps = 1000 / frameDuration;

    this.addMetric('fps', fps);
    this.frameCount++;

    // Update current FPS less frequently for stable display
    if (now - this.lastFpsUpdate > this.fpsUpdateInterval) {
      this.currentFps = this.getAverage('fps');
      this.lastFpsUpdate = now;
    }

    // Update memory usage (if available)
    if (performance.memory) {
      const memoryMB = performance.memory.usedJSHeapSize / 1048576;
      this.addMetric('memoryUsage', memoryMB);
    }
  }

  /**
   * Add a metric value to the tracking array
   */
  addMetric(name, value) {
    if (!this.metrics[name]) {
      this.metrics[name] = [];
    }

    this.metrics[name].push(value);

    // Keep only the last N samples
    if (this.metrics[name].length > this.maxSamples) {
      this.metrics[name].shift();
    }
  }

  /**
   * Get average of a metric
   */
  getAverage(name) {
    const values = this.metrics[name];
    if (!values || values.length === 0) return 0;

    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }

  /**
   * Get all averages
   */
  getAverages() {
    const averages = {};
    for (const key in this.metrics) {
      averages[key] = this.getAverage(key);
    }
    return averages;
  }

  /**
   * Get current FPS (smoothed)
   */
  getFPS() {
    return Math.round(this.currentFps);
  }

  /**
   * Get current memory usage in MB
   */
  getMemoryUsage() {
    const avg = this.getAverage('memoryUsage');
    return avg > 0 ? avg.toFixed(1) : '--';
  }

  /**
   * Get frame count
   */
  getFrameCount() {
    return this.frameCount;
  }

  /**
   * Log performance report to console
   */
  logReport() {
    const avg = this.getAverages();
    console.log('📊 Performance Report:');
    console.log(`   FPS: ${avg.fps.toFixed(1)}`);
    console.log(`   Particle Update: ${avg.particleUpdateTime.toFixed(2)}ms`);
    console.log(`   Render Time: ${avg.renderTime.toFixed(2)}ms`);
    if (avg.memoryUsage > 0) {
      console.log(`   Memory Usage: ${avg.memoryUsage.toFixed(1)}MB`);
    }
  }

  /**
   * Check if performance is below threshold
   */
  isPerformanceLow(fpsThreshold = 30) {
    return this.currentFps < fpsThreshold && this.frameCount > 60;
  }

  /**
   * Reset all metrics
   */
  reset() {
    for (const key in this.metrics) {
      this.metrics[key] = [];
    }
    this.frameCount = 0;
    this.currentFps = 0;
    this.lastTime = performance.now();
    this.lastFpsUpdate = performance.now();
  }
}

export default PerformanceMonitor;
