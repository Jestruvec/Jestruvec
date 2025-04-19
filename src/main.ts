import "./style.css";
import { setupScene } from "@/lib/scene";
import { initMap } from "@/lib/scene";
import { initPirateCaptain, animateMovement } from "@/lib/character";
import { followPirate } from "@/lib/camera";
import * as THREE from "three";
import { animateAttack } from "./lib/character/attack";
import { initSkeleton, animateSkeletons } from "./lib/mobs/";

const main = async () => {
  let chestlife = { value: 10 };

  const resultScreenEl = document.querySelector(
    "#result-screen"
  ) as HTMLDivElement;
  const chestLifeEl = document.querySelector(
    "#chestlife progress"
  ) as HTMLProgressElement;

  const restartGame = () => {
    chestlife.value = 10;
    chestLifeEl.value = chestlife.value;

    pirateCaptain.model.position.set(0, 0, -20);

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

  document
    .querySelector("#result-screen button")
    ?.addEventListener("click", restartGame);

  const canvas = document.querySelector("canvas")!;
  const { scene, camera, renderer } = setupScene(canvas);
  const clock = new THREE.Clock();
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

    // Actualizar esqueletos
    animateSkeletons(
      delta,
      scene,
      renderer,
      chestlife,
      skeletons,
      pirateCaptain
    );

    // Cámara sigue al pirata
    followPirate(camera, pirateCaptain.model);

    // Renderizado
    renderer.render(scene, camera);
  };

  renderer.setAnimationLoop(animate);
};

main();
