import * as THREE from "three";

/**
 * MouseInteraction - Handles mouse movement and particle interaction
 * Creates a force field around the cursor that displaces particles
 */
export class MouseInteraction {
  constructor(camera, renderer) {
    this.camera = camera;
    this.renderer = renderer;

    // Mouse position in normalized device coordinates (-1 to +1)
    this.mouse = new THREE.Vector2(999, 999); // Start off-screen
    this.smoothMouse = new THREE.Vector2(999, 999);

    // Mouse position in 3D world space
    this.mouseWorld = new THREE.Vector3();

    // Raycaster for 3D position
    this.raycaster = new THREE.Raycaster();

    // Interaction parameters
    this.interactionRadius = 8.0; // How far the effect reaches
    this.interactionStrength = 5.0; // How strong the displacement is
    this.smoothingFactor = 0.15; // Smoothing for mouse movement (0-1)

    // State
    this.isMouseActive = false;
    this.mouseVelocity = new THREE.Vector2();
    this.lastMouse = new THREE.Vector2();

    this.addEventListeners();
  }

  /**
   * Add event listeners for mouse movement
   */
  addEventListeners() {
    // Mouse move
    window.addEventListener("mousemove", (event) => this.onMouseMove(event));

    // Mouse enter/leave
    window.addEventListener("mouseenter", () => {
      this.isMouseActive = true;
    });

    window.addEventListener("mouseleave", () => {
      this.isMouseActive = false;
      this.mouse.set(999, 999); // Move off-screen
    });

    // Touch support for mobile
    window.addEventListener(
      "touchmove",
      (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        this.onMouseMove(touch);
      },
      { passive: false },
    );

    window.addEventListener("touchend", () => {
      this.isMouseActive = false;
      this.mouse.set(999, 999);
    });

    console.log("✅ Mouse interaction listeners added");
  }

  /**
   * Handle mouse move event
   */
  onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.isMouseActive = true;

    // Calculate velocity
    this.mouseVelocity.x = this.mouse.x - this.lastMouse.x;
    this.mouseVelocity.y = this.mouse.y - this.lastMouse.y;

    this.lastMouse.copy(this.mouse);
  }

  /**
   * Update mouse position and calculate 3D world position
   */
  update() {
    if (!this.isMouseActive) {
      return;
    }

    // Smooth mouse movement for more organic feel
    this.smoothMouse.x +=
      (this.mouse.x - this.smoothMouse.x) * this.smoothingFactor;
    this.smoothMouse.y +=
      (this.mouse.y - this.smoothMouse.y) * this.smoothingFactor;

    // Update raycaster
    this.raycaster.setFromCamera(this.smoothMouse, this.camera);

    // Project mouse to a plane in 3D space (at y=0)
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.raycaster.ray.intersectPlane(plane, this.mouseWorld);
  }

  /**
   * Get mouse position in world space
   * @returns {THREE.Vector3}
   */
  getMouseWorldPosition() {
    return this.mouseWorld;
  }

  /**
   * Get smooth mouse position in normalized coordinates
   * @returns {THREE.Vector2}
   */
  getSmoothMousePosition() {
    return this.smoothMouse;
  }

  /**
   * Get mouse velocity
   * @returns {THREE.Vector2}
   */
  getMouseVelocity() {
    return this.mouseVelocity;
  }

  /**
   * Check if mouse is active
   * @returns {boolean}
   */
  isActive() {
    return this.isMouseActive;
  }

  /**
   * Get interaction radius
   * @returns {number}
   */
  getInteractionRadius() {
    return this.interactionRadius;
  }

  /**
   * Set interaction radius
   * @param {number} radius
   */
  setInteractionRadius(radius) {
    this.interactionRadius = radius;
  }

  /**
   * Get interaction strength
   * @returns {number}
   */
  getInteractionStrength() {
    return this.interactionStrength;
  }

  /**
   * Set interaction strength
   * @param {number} strength
   */
  setInteractionStrength(strength) {
    this.interactionStrength = strength;
  }

  /**
   * Cleanup event listeners
   */
  dispose() {
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseenter", this.onMouseMove);
    window.removeEventListener("mouseleave", this.onMouseMove);
    window.removeEventListener("touchmove", this.onMouseMove);
    window.removeEventListener("touchend", this.onMouseMove);
  }
}

export default MouseInteraction;
