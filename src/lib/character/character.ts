import * as THREE from "three";
import { createMesh } from "@/lib/helpers/createMesh";
import { Pirate_Captain } from "@/assets/glbs";

export async function initPirateCaptain(scene: THREE.Scene) {
  const { Model } = createMesh();
  const pirate = await Model(Pirate_Captain);
  pirate.model.position.set(0, 0, -20);

  const idleClip = pirate.animations.find((clip) =>
    clip.name.toLowerCase().includes("idle")
  );

  if (idleClip) {
    const idleAction = pirate.mixer.clipAction(idleClip);
    idleAction.reset().play(); // Reproducimos idle desde el inicio
  }

  scene.add(pirate.model);

  return pirate;
}
