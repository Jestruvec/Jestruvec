import * as THREE from "three";
import { CustomCamera } from "./camera";

export class Game {
  scene = new THREE.Scene();
  camera: CustomCamera;
  renderer: THREE.WebGLRenderer;
  clock = new THREE.Clock();
  animateFn: (() => void) | null = null;
  listener = new THREE.AudioListener();
  audioLoader = new THREE.AudioLoader();
  backgroundSound = new THREE.Audio(this.listener);

  private joystick: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private keysPressed = new Set<string>();
  private keysToSimulate = new Set<string>();
  private mouseMoveTimeout: ReturnType<typeof setTimeout> | null = null;
  mouseDeltaX = 0;
  mouseDeltaY = 0;
  private isTouching = false;
  private lastTouchX = 0;
  private lastTouchY = 0;
  private joystickTouchStartX = 0;
  private joystickTouchStartY = 0;

  protected constructor(canvas: HTMLCanvasElement, joystick: HTMLDivElement) {
    this.canvas = canvas;
    this.joystick = joystick;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera = new CustomCamera(75, width / height, 0.1, 1000);
    // esto es para la primera carga de interstellar, sacarlo de aqui, pasar parametro
    this.camera.position.set(-6.8, 3, 4.32);
    this.camera.lookAt(0, 0, 0);
    //
    this.camera.add(this.listener);

    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.initEventListeners();
  }

  start(animateFn: () => void) {
    this.animateFn = animateFn;
    this.renderer.setAnimationLoop(this.animateFn);
  }
  pause() {
    this.renderer.setAnimationLoop(null);
  }
  resume() {
    if (this.animateFn) {
      this.renderer.setAnimationLoop(this.animateFn);
    }
  }
  getEffectiveKeys = () => {
    return new Set([...this.keysPressed, ...this.keysToSimulate]);
  };

  private initEventListeners() {
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("click", this.handleAudioResume);
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("keyup", this.handleKeyup);
    window.addEventListener("touchstart", this.handleTouchStart);
    window.addEventListener("touchmove", this.handleTouchMove);
    window.addEventListener("touchend", this.handleTouchEnd);
    this.joystick.addEventListener("touchstart", this.handleJoystickTouchStart);
    this.joystick.addEventListener("touchmove", this.handleJoystickTouchMove);
    this.joystick.addEventListener("touchend", this.handleJoystickTouchEnd);
  }
  private handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };
  private handleAudioResume = () => {
    if (!this.backgroundSound.isPlaying) {
      this.backgroundSound.play();
    }
  };
  private handleMouseMove = (e: MouseEvent) => {
    if (document.pointerLockElement === this.canvas) {
      this.mouseDeltaX = e.movementX;
      this.mouseDeltaY = e.movementY;

      if (this.mouseMoveTimeout) clearTimeout(this.mouseMoveTimeout);
      this.mouseMoveTimeout = setTimeout(() => {
        this.mouseDeltaX = 0;
        this.mouseDeltaY = 0;
      }, 50);
    }
  };
  private handleKeydown = (e: KeyboardEvent) => {
    this.keysPressed.add(e.key.toLowerCase());
  };
  private handleKeyup = (e: KeyboardEvent) => {
    this.keysPressed.delete(e.key.toLowerCase());
  };
  private handleTouchStart = (e: TouchEvent) => {
    const touch = e.changedTouches[0];

    this.isTouching = true;
    this.lastTouchX = touch.clientX;
    this.lastTouchY = touch.clientY;
  };
  private handleTouchMove = (e: TouchEvent) => {
    if (this.isTouching && e.touches.length) {
      const touch = e.touches[0];

      this.mouseDeltaX = touch.clientX - this.lastTouchX;
      this.mouseDeltaY = touch.clientY - this.lastTouchY;

      this.lastTouchX = touch.clientX;
      this.lastTouchY = touch.clientY;

      if (this.mouseMoveTimeout) clearTimeout(this.mouseMoveTimeout);
      this.mouseMoveTimeout = setTimeout(() => {
        this.mouseDeltaX = 0;
        this.mouseDeltaY = 0;
      }, 50);
    }
  };
  private handleTouchEnd = () => {
    this.isTouching = false;
  };
  private handleJoystickTouchStart = (e: TouchEvent) => {
    const touch = e.changedTouches[0];

    this.joystickTouchStartX = touch.clientX;
    this.joystickTouchStartY = touch.clientY;
  };
  private handleJoystickTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    const dx = touch.clientX - this.joystickTouchStartX;
    const dy = touch.clientY - this.joystickTouchStartY;
    this.updateJoystick(dx, dy);
  };
  private handleJoystickTouchEnd = () => {
    this.resetJoystick();
  };
  private updateJoystick = (dx: number, dy: number) => {
    // const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 40;

    const angle = (Math.atan2(-dy, -dx) * 180) / Math.PI + 180;

    const clampedDx = Math.min(maxDistance, Math.max(-maxDistance, dx));
    const clampedDy = Math.min(maxDistance, Math.max(-maxDistance, dy));

    this.joystick.style.left = `${40 + clampedDx}px`;
    this.joystick.style.top = `${40 + clampedDy}px`;

    this.keysToSimulate.clear();
    for (const dir of this.getDirectionFromAngle(angle)) {
      this.keysToSimulate.add(dir);
    }
  };
  private resetJoystick = () => {
    this.joystick.style.left = `40px`;
    this.joystick.style.top = `40px`;
    this.keysToSimulate.clear();
  };
  private getDirectionFromAngle = (angle: number) => {
    const direction = new Set<string>();

    if (angle >= 45 && angle < 135) direction.add("s"); // down
    else if (angle >= 135 && angle < 225) direction.add("a"); // left
    else if (angle >= 225 && angle < 315) direction.add("w"); // up
    else direction.add("d"); // right

    return direction;
  };
}
