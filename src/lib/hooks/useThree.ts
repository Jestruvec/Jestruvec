import * as THREE from "three";
import { CAMERA_SETTINGS } from "@/lib/constants/Constants";
import { OrbitControls } from "three-stdlib";

export const useThree = () => {
  const scene = new THREE.Scene();
  const clock = new THREE.Clock();

  const createRenderer = (canvas: HTMLCanvasElement) => {
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: canvas,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    return renderer;
  };

  const createCamera = () => {
    const { fov, aspectRatio, near, far, position } = CAMERA_SETTINGS;

    const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);

    camera.position.set(position.x, position.y, position.z);

    return camera;
  };

  const createOrbitControls = (
    camera: THREE.PerspectiveCamera,
    domElement: HTMLCanvasElement
  ) => {
    const controls = new OrbitControls(camera, domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    return controls;
  };

  return {
    scene,
    clock,
    createRenderer,
    createCamera,
    createOrbitControls,
  };
};
