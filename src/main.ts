import "./style.css";
import { setupScene } from "@/lib/scene";
import { initMap } from "@/lib/scene";
import { initPirateCaptain, animateMovement } from "@/lib/character";
import { followPirate } from "@/lib/camera";
import * as THREE from "three";
import { animateAttack } from "./lib/character/attack";
import { initMob, animateMobs } from "./lib/mobs/";
import { setupAudio } from "@/lib/scene/setupAudio";
import { AnimatedModel } from "./lib/types/AnimatedModel";

const main = async () => {
  const canvas = document.querySelector("canvas")!;
  const { scene, camera, renderer } = setupScene(canvas);
  const {
    swordSound,
    hitSound,
    deathSound,
    oceanSound: backgroundSound,
  } = setupAudio(camera);
  const clock = new THREE.Clock();
  const character = await initPirateCaptain(scene);
  const skeletons: AnimatedModel[] = [];
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

    character.model.position.set(0, 0, -20);

    for (let i = skeletons.length - 1; i >= 0; i--) {
      const skeleton = skeletons[i];
      scene.remove(skeleton.model);
      skeletons.splice(i, 1);
    }

    const deathClip = character.animations.find((clip) =>
      clip.name.toLowerCase().includes("death")
    );
    const idleClip = character.animations.find((clip) =>
      clip.name.toLowerCase().includes("idle")
    );

    if (deathClip) {
      const deathAction = character.mixer.clipAction(deathClip);
      deathAction.stop();
    }

    if (idleClip) {
      const idleAction = character.mixer.clipAction(idleClip);
      idleAction.reset().play();
    }

    resultScreenEl.style.visibility = "hidden";
    renderer.setAnimationLoop(animate);
  };

  const finishGame = () => {
    const deathClip = character.animations.find((clip) =>
      clip.name.toLowerCase().includes("death")
    );

    if (deathClip) {
      const deathAction = character.mixer.clipAction(deathClip);
      deathAction.setLoop(THREE.LoopOnce, 1);
      deathAction.clampWhenFinished = true;
      deathAction.play();
      deathSound.play();
    }

    backgroundSound.stop();

    setTimeout(() => {
      resultScreenEl.style.visibility = "visible";
      renderer.setAnimationLoop(null);
    }, 2000);
  };

  document
    .querySelector("#result-screen button")
    ?.addEventListener("click", restartGame);

  await initMap(scene);

  setInterval(async () => {
    const skeleton = await initMob(scene);
    skeletons.push(skeleton);
  }, 2000);

  animateMovement(character, scene);
  animateAttack(character);

  const animate = () => {
    const delta = clock.getDelta();

    //actualizar pirata
    character.update(delta);

    // Actualizar esqueletos
    animateMobs(
      delta,
      scene,
      chestlife,
      skeletons,
      character,
      swordSound,
      hitSound
    );

    if (chestlife.value <= 0) {
      finishGame();
    }

    // Cámara sigue al pirata
    followPirate(camera, character.model);

    // Renderizado
    renderer.render(scene, camera);
  };

  renderer.setAnimationLoop(animate);
};

main();
