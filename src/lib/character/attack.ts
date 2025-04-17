import * as THREE from "three";
import { AnimatedModel } from "../types/AnimatedModel";

export function animateAttack(player: AnimatedModel) {
  const swordClip = player.animations.find((clip) =>
    clip.name.toLowerCase().includes("sword")
  );

  if (!swordClip) return console.warn("Sword animation not found");

  const swordAction = player.mixer.clipAction(swordClip);

  swordAction.setLoop(THREE.LoopOnce, 1);
  swordAction.clampWhenFinished = true;

  window.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      if (!swordAction.isRunning()) {
        swordAction.reset().play();
      }
    }
  });
}
