import * as THREE from "three";
import { createMesh } from "@/lib/helpers/createMesh";
import { Skeleton_1, Skeleton_2, Sharky } from "@/assets/glbs";
import { GetRandomPosition } from "@/lib/helpers/GetRandomPosition";

export async function initMob(scene: THREE.Scene) {
  const { inRange } = GetRandomPosition();
  const { Model } = createMesh();

  const mobOptions = [Skeleton_1, Skeleton_2, Sharky];
  const randomIndex = Math.floor(Math.random() * mobOptions.length);
  const selectedMob = mobOptions[randomIndex];

  const mob = await Model(selectedMob);

  // Intentar hasta encontrar una posición en el agua
  let x: number, z: number, distanceFromCenter: number;
  const half = 100 / 2; // o el mismo valor que usas en el generador de terreno

  do {
    x = inRange(-half, half);
    z = inRange(-half, half);
    distanceFromCenter = Math.sqrt(x * x + z * z);
  } while (distanceFromCenter <= half * 0.5); // si es <=, está en tierra

  mob.model.position.set(x, 0, z);
  mob.model.rotation.y = Math.PI;

  const walkClip = mob.animations.find((clip) =>
    clip.name.toLowerCase().includes("walk")
  );

  if (walkClip) {
    const walkAction = mob.mixer.clipAction(walkClip);
    walkAction.play();
  }

  scene.add(mob.model);

  return mob;
}
