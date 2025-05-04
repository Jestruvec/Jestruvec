import * as THREE from "three";
import { getDOMElements } from "@/utils";
import { CustomCamera } from "./camera";

let instance: {
  scene: THREE.Scene;
  camera: CustomCamera;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
} | null = null;

export const sceneSetup = () => {
  if (instance) {
    return instance;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const clock = new THREE.Clock();

  const width = window.innerWidth;
  const height = window.innerHeight;

  const camera = new CustomCamera(75, width / height, 0.1, 1000);

  const { canvasDOM } = getDOMElements();
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
