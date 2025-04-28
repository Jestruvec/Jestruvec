import * as THREE from "three";
import { getDOMElements } from "@/utils";

let instance: {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
} | null = null;

export const sceneSetup = () => {
  if (instance) {
    return instance;
  }

  const { canvasDOM } = getDOMElements();
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const clock = new THREE.Clock();

  const width = window.innerWidth;
  const height = window.innerHeight;

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({ canvas: canvasDOM });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  instance = {
    scene,
    camera,
    renderer,
    clock,
  };

  return instance;
};
