import * as THREE from "three";
import { CAMERA_SETTINGS } from "@/lib/constants/Constants";

export const useThree = () => {
  const scene = new THREE.Scene();

  const createRenderer = (canvas: HTMLCanvasElement) => {
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: canvas,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.shadowMap.enabled = true;

    return renderer;
  };

  const createCamera = () => {
    const { fov, aspectRatio, near, far } = CAMERA_SETTINGS;
    const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);

    camera.position.set(-10, 10, 15);
    camera.lookAt(0, 10, 0);
    return camera;
  };

  return {
    scene,
    createRenderer,
    createCamera,
  };
};
