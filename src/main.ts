import "./style.css";
import { setupScene } from "@/lib/scene";
import { initMap } from "@/lib/scene";
import { initPirateCaptain, animateMovement } from "@/lib/character";
import { followPirate } from "@/lib/camera";
import * as THREE from "three";

const main = async () => {
  const canvas = document.querySelector("canvas")!;
  const { scene, camera, renderer } = setupScene(canvas);
  const clock = new THREE.Clock();

  // Inicializa el mapa
  await initMap(scene);

  // Inicializa el pirata
  const pirateCaptain = await initPirateCaptain(scene);

  // Lógica de movimiento del personaje
  animateMovement(pirateCaptain, scene);

  const animate = () => {
    const delta = clock.getDelta();
    pirateCaptain.update(delta);

    // Cámara sigue al pirata
    followPirate(camera, pirateCaptain.model);

    // Renderizado
    renderer.render(scene, camera);
  };

  // Loop de animación
  renderer.setAnimationLoop(animate);
};

main();
