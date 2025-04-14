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
  controls.target.set(0, 0, 0);
  controls.update();

  //Iluminacion
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(10, 20, 10); // dirección desde la cual "pega el sol"
  directionalLight.castShadow = true;

  // Configuración de sombras (opcional pero útil)
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 100;
  directionalLight.shadow.camera.left = -50;
  directionalLight.shadow.camera.right = 50;
  directionalLight.shadow.camera.top = 50;
  directionalLight.shadow.camera.bottom = -50;

  // Luz ambiental suave para relleno
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);

  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  };

  // Puedes agregar el listener directamente aquí o exportar la función
  window.addEventListener("resize", handleResize);

  scene.add(ambientLight, directionalLight);

  renderer.setSize(window.innerWidth, window.innerHeight);

  return { scene, camera, renderer };
}
