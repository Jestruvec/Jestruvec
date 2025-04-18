import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

export function setupScene(canvasDOM: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ canvas: canvasDOM });
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  //Iluminacion
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);

  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  };

  window.addEventListener("resize", handleResize);

  scene.add(ambientLight, directionalLight);

  renderer.setSize(window.innerWidth, window.innerHeight);

  return { scene, camera, renderer };
}
