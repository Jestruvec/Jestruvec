import * as THREE from "three";
import { AnimatedModel } from "../types/AnimatedModel";

const speed = 1;
const targetPoint: THREE.Vector3 = new THREE.Vector3(0, 0, -15);
const chestLifeEl = document.querySelector(
  "#chestlife progress"
) as HTMLProgressElement;

export const animateMobs = (
  delta: number,
  scene: THREE.Scene,
  chestLife: { value: number },
  mobs: AnimatedModel[],
  character: AnimatedModel,
  swordSound: THREE.Audio,
  hitSound: THREE.Audio
) => {
  for (let i = mobs.length - 1; i >= 0; i--) {
    const mob = mobs[i];

    if (mob.isDying) {
      mob.update(delta);

      continue;
    }

    const characterPosition: THREE.Vector3 = character.model.position.clone();

    const direction = targetPoint.clone().sub(mob.model.position);
    direction.y = 0;
    direction.normalize();
    mob.model.position.add(direction.multiplyScalar(speed * delta));

    const distance = mob.model.position.distanceTo(targetPoint);
    const distanceToCharacter =
      mob.model.position.distanceTo(characterPosition);

    if (distanceToCharacter < 1) {
      attackMob(character, swordSound);
      removeMob(scene, mob, mobs);
    }

    if (distance < 0.5) {
      chestLife.value = Math.max(0, chestLife.value - 1);
      chestLifeEl.value = chestLife.value;

      if (hitSound.isPlaying) hitSound.stop();
      hitSound.play();

      removeMob(scene, mob, mobs);
    }

    mob.update(delta);
  }
};

const attackMob = (character: AnimatedModel, swordSound: THREE.Audio) => {
  const swordClip = character.animations.find((clip) =>
    clip.name.toLowerCase().includes("sword")
  );
  const swordAction = character.mixer.clipAction(swordClip);
  swordAction.setLoop(THREE.LoopOnce, 1);
  swordAction.clampWhenFinished = true;
  swordAction.reset().play();

  if (swordSound.isPlaying) swordSound.stop();
  swordSound.play();
};

const removeMob = (
  scene: THREE.Scene,
  mob: AnimatedModel,
  mobs: AnimatedModel[]
) => {
  if (mob.isDying) return;

  mob.isDying = true;

  const deathClip = mob.animations.find((clip) =>
    clip.name.toLowerCase().includes("death")
  );

  if (!deathClip) {
    scene.remove(mob.model);
    const index = mobs.indexOf(mob);
    if (index !== -1) mobs.splice(index, 1);
    return;
  }

  const deathAction = mob.mixer.clipAction(deathClip);
  deathAction.setLoop(THREE.LoopOnce, 1);
  deathAction.clampWhenFinished = true;
  deathAction.reset().play();

  setTimeout(() => {
    scene.remove(mob.model);
    const index = mobs.indexOf(mob);
    if (index !== -1) mobs.splice(index, 1);
  }, 2000);
};
