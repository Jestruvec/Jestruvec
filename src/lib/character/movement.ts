import * as THREE from "three";
import { updateMapOnMove } from "@/lib/scene";
import { AnimatedModel } from "../types/AnimatedModel";

type Direction = "up" | "down" | "left" | "right";

const tileSize = 1;
// let isMoving = false;

export function animateMovement(player: AnimatedModel, scene: THREE.Scene) {
  const walkClip = player.animations.find((clip) =>
    clip.name.toLowerCase().includes("walk")
  );
  const jumpClip = player.animations.find((clip) => {
    return clip.name.toLowerCase().includes("jump");
  });

  const walkAction = player.mixer.clipAction(walkClip);
  const jumpAction = player.mixer.clipAction(jumpClip);

  const keysPressed: Set<string> = new Set();

  window.addEventListener("keydown", async (e) => {
    keysPressed.add(e.key);

    // if (isMoving) return;

    // Salto: ejecutarlo aunque esté moviéndose
    if (e.key === " " && !jumpAction.isRunning()) {
      jumpAction.reset();
      jumpAction.setLoop(THREE.LoopOnce, 1);
      jumpAction.play();
    }

    // Movimiento direccional
    let direction: Direction | null = null;

    if (["ArrowUp", "w"].includes(e.key)) direction = "up";
    else if (["ArrowDown", "s"].includes(e.key)) direction = "down";
    else if (["ArrowLeft", "a"].includes(e.key)) direction = "left";
    else if (["ArrowRight", "d"].includes(e.key)) direction = "right";

    if (direction) {
      if (!walkAction.isRunning()) walkAction.play();

      await movePlayer(player.model, direction);
      updateMapOnMove(scene, player.model);
    }
  });

  window.addEventListener("keyup", (e) => {
    keysPressed.delete(e.key);

    if (
      !keysPressed.has("ArrowUp") &&
      !keysPressed.has("ArrowDown") &&
      !keysPressed.has("ArrowLeft") &&
      !keysPressed.has("ArrowRight") &&
      !keysPressed.has("w") &&
      !keysPressed.has("a") &&
      !keysPressed.has("s") &&
      !keysPressed.has("d")
    ) {
      walkAction.stop();
    }
  });
}

async function movePlayer(player: THREE.Object3D, direction: Direction) {
  // isMoving = true;

  const from = player.position.clone();
  const to = from.clone();

  switch (direction) {
    case "up":
      to.z += tileSize;
      player.rotation.y = 0;
      break;
    case "down":
      to.z -= tileSize;
      player.rotation.y = Math.PI;
      break;
    case "left":
      to.x += tileSize;
      player.rotation.y = Math.PI / 2;
      break;
    case "right":
      to.x -= tileSize;
      player.rotation.y = -Math.PI / 2;
      break;
  }

  const duration = 100; // ms
  const steps = 20;
  const stepTime = duration / steps;

  for (let i = 1; i <= steps; i++) {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        player.position.lerpVectors(from, to, i / steps);
        resolve();
      }, stepTime);
    });
  }

  // isMoving = false;
}
