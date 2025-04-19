import * as THREE from "three";
import { AnimatedModel } from "../types/AnimatedModel";

interface Mob {
  model: THREE.Object3D;
  update: (dt: number) => void;
}

const speed = 1;
const targetPoint: THREE.Vector3 = new THREE.Vector3(0, 0, -15);
const chestLifeEl = document.querySelector(
  "#chestlife progress"
) as HTMLProgressElement;
const resultScreenEl = document.querySelector(
  "#result-screen"
) as HTMLDivElement;

const removeSkeleton = (
  scene: THREE.Scene,
  skeleton: Mob,
  skeletons: Mob[],
  i: number
) => {
  scene.remove(skeleton.model);
  skeletons.splice(i, 1);
};

export const animateSkeletons = (
  delta: number,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  chestLife: { value: number },
  skeletons: { model: THREE.Object3D; update: (dt: number) => void }[],
  character: AnimatedModel
) => {
  for (let i = skeletons.length - 1; i >= 0; i--) {
    const skeleton = skeletons[i];

    const characterPosition: THREE.Vector3 = character.model.position.clone();

    const direction = targetPoint.clone().sub(skeleton.model.position);
    direction.y = 0;
    direction.normalize();
    skeleton.model.position.add(direction.multiplyScalar(speed * delta));

    skeleton.update(delta);

    const distance = skeleton.model.position.distanceTo(targetPoint);
    const distanceToCharacter =
      skeleton.model.position.distanceTo(characterPosition);

    if (distanceToCharacter < 0.5) {
      const swordClip = character.animations.find((clip) =>
        clip.name.toLowerCase().includes("sword")
      );
      const swordAction = character.mixer.clipAction(swordClip);
      swordAction.setLoop(THREE.LoopOnce, 1);
      swordAction.clampWhenFinished = true;
      swordAction.reset().play();

      removeSkeleton(scene, skeleton, skeletons, i);
    }

    if (distance < 0.5) {
      chestLife.value = Math.max(0, chestLife.value - 1);
      chestLifeEl.value = chestLife.value;

      removeSkeleton(scene, skeleton, skeletons, i);
    }
  }

  if (chestLife.value <= 0) {
    const deathClip = character.animations.find((clip) =>
      clip.name.toLowerCase().includes("death")
    );

    if (deathClip) {
      const deathAction = character.mixer.clipAction(deathClip);
      deathAction.setLoop(THREE.LoopOnce, 1);
      deathAction.clampWhenFinished = true;
      deathAction.play();
    }

    setTimeout(() => {
      resultScreenEl.style.visibility = "visible";
      renderer.setAnimationLoop(null);
    }, 2000);
  }
};
