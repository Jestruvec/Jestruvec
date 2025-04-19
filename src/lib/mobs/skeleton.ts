import * as THREE from "three";
import { createMesh } from "@/lib/helpers/createMesh";
import { Skeleton_2 } from "@/assets/glbs";
import { GetRandomPosition } from "@/lib/helpers/GetRandomPosition";

export async function initSkeleton(scene: THREE.Scene) {
  const { inRange } = GetRandomPosition();
  const { Model } = createMesh();
  const skeleton = await Model(Skeleton_2);

  const x = inRange(-25, 25);
  const z = inRange(10, 25);

  // const scale = Math.random() < 0.7 ? 1 : 2;
  // skeleton.model.scale.set(scale, scale, scale);

  skeleton.model.position.set(x, 0, z);
  skeleton.model.rotation.y = Math.PI;

  const walkClip = skeleton.animations.find((clip) =>
    clip.name.toLowerCase().includes("walk")
  );

  if (walkClip) {
    const walkAction = skeleton.mixer.clipAction(walkClip);
    walkAction.play();
  }

  scene.add(skeleton.model);

  return skeleton;
}
