import "./style.css";
import { setupScene } from "@/lib/scene";
import { initMap } from "@/lib/scene";
import { initPirateCaptain, animateMovement } from "@/lib/character";
import { followPirate } from "@/lib/camera";
import * as THREE from "three";
import { animateAttack } from "./lib/character/attack";
import { initSkeleton } from "./lib/mobs/skeleton";

const main = async () => {
  const chestLifeEl = document.querySelector(
    "#chestlife progress"
  ) as HTMLProgressElement;
  const resultScreenEl = document.querySelector(
    "#result-screen"
  ) as HTMLDivElement;
  const restartButtonEl = document.querySelector(
    "#result-screen button"
  ) as HTMLButtonElement;

  let chestLife = 10;
  chestLifeEl.value = chestLife;

  const restartGame = () => {
    pirateCaptain.model.position.set(0, 0, -20);
    chestLife = 10;
    chestLifeEl.value = chestLife;

    for (let i = skeletons.length - 1; i >= 0; i--) {
      const skeleton = skeletons[i];
      scene.remove(skeleton.model);
      skeletons.splice(i, 1);
    }

    const deathClip = pirateCaptain.animations.find((clip) =>
      clip.name.toLowerCase().includes("death")
    );
    const idleClip = pirateCaptain.animations.find((clip) =>
      clip.name.toLowerCase().includes("idle")
    );

    if (deathClip) {
      const deathAction = pirateCaptain.mixer.clipAction(deathClip);
      deathAction.stop();
    }

    if (idleClip) {
      const idleAction = pirateCaptain.mixer.clipAction(idleClip);
      idleAction.reset().play();
    }

    resultScreenEl.style.visibility = "hidden";
    renderer.setAnimationLoop(animate);
  };

  if (restartButtonEl) {
    restartButtonEl.addEventListener("click", restartGame);
  }

  const canvas = document.querySelector("canvas")!;
  const { scene, camera, renderer } = setupScene(canvas);
  const clock = new THREE.Clock();
  const targetPoint = new THREE.Vector3(0, 0, -15);
  const pirateCaptain = await initPirateCaptain(scene);
  const skeletons: { model: THREE.Object3D; update: (dt: number) => void }[] =
    [];

  await initMap(scene);

  setInterval(async () => {
    const skeleton = await initSkeleton(scene);
    skeletons.push(skeleton);
  }, 5000);

  animateMovement(pirateCaptain, scene);
  animateAttack(pirateCaptain);

  const animate = () => {
    const delta = clock.getDelta();
    //actualizar pirata
    pirateCaptain.update(delta);

    // Actualizar esqueletos y eliminar los que ya llegaron
    for (let i = skeletons.length - 1; i >= 0; i--) {
      const skeleton = skeletons[i];
      skeleton.update(delta);

      const distance = skeleton.model.position.distanceTo(targetPoint);

      if (distance < 0.5) {
        chestLife = Math.max(0, chestLife - 1);
        chestLifeEl.value = chestLife;

        scene.remove(skeleton.model);
        skeletons.splice(i, 1);
      }
    }

    if (chestLife <= 0) {
      const deathClip = pirateCaptain.animations.find((clip) =>
        clip.name.toLocaleLowerCase().includes("death")
      );

      if (deathClip) {
        const deathAction = pirateCaptain.mixer.clipAction(deathClip);
        deathAction.setLoop(THREE.LoopOnce, 1);
        deathAction.clampWhenFinished = true;
        deathAction.play();
      }

      setTimeout(() => {
        resultScreenEl.style.visibility = "visible";
        renderer.setAnimationLoop(null);
      }, 1000);
    }

    // Cámara sigue al pirata
    followPirate(camera, pirateCaptain.model);

    // Renderizado
    renderer.render(scene, camera);
  };

  // Loop de animación
  renderer.setAnimationLoop(animate);
};

main();
