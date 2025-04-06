import * as THREE from "three";

export const handleResize = (
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | null
) => {
  if (!renderer || !camera) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  // Actualizar renderizador
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Actualizar cámara
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};
