import * as THREE from "three";
import { CAMERA_SETTINGS } from "@/lib/constants/Constants";

export const useThree = () => {
  const scene = new THREE.Scene();

  const createRenderer = (canvas: HTMLCanvasElement) => {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    return renderer;
  };

  const createCamera = () => {
    const { fov, aspectRatio, near, far, position, lookAt } = CAMERA_SETTINGS;
    const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);

    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
    return camera;
  };

  return {
    scene,
    createRenderer,
    createCamera,
  };
};
