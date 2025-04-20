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

  const x = inRange(-25, 25);
  const z = inRange(10, 25);

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
