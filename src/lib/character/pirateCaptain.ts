import * as THREE from "three";
import { createMesh } from "@/lib/helpers/createMesh";
import { Pirate_Captain } from "@/assets/glbs";

export async function initPirateCaptain(scene: THREE.Scene) {
  const { Model } = createMesh();
  const pirate = await Model(Pirate_Captain);
  scene.add(pirate.model);

  return pirate;
}
