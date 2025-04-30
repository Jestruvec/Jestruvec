import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import { AnimatedModel } from "@/lib/types";
import { getPublicUrl } from "@/lib/services";

export type ModelKey = "Astronaut" | "Spaceship";

const loader = new GLTFLoader();
const models: Record<string, AnimatedModel> = {};

const Model = async (
  modelPath: string
): Promise<{
  model: THREE.Group;
  animations: THREE.AnimationClip[];
  mixer: THREE.AnimationMixer;
  update: (delta: number) => void;
}> => {
  return new Promise((resolve, reject) => {
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene as THREE.Group;
        const animations = gltf.animations;
        const mixer = new THREE.AnimationMixer(model);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });

        resolve({
          model,
          animations,
          mixer,
          update: (delta: number) => mixer.update(delta),
        });
      },
      undefined,
      (error: ErrorEvent) => {
        console.error("Error al cargar el modelo:", error.message);
        reject(error);
      }
    );
  });
};

export const getModel = (key: ModelKey): AnimatedModel => {
  const original = models[key];
  if (!original) throw new Error(`Model "${key}" not loaded`);

  const modelClone = clone(original.model); // Mantiene esqueleto y animaciones
  const mixer = new THREE.AnimationMixer(modelClone);

  return {
    model: modelClone,
    animations: original.animations,
    mixer,
    update: (delta: number) => mixer.update(delta),
  };
};

export const loadModels = async () => {
  const astronautUrl = getPublicUrl("models", "Astronaut.glb");
  const spaceshipUrl = getPublicUrl("models", "Spaceship.glb");

  //nota: arreglar el uso de "!"
  const entries: [ModelKey, string][] = [
    ["Astronaut", astronautUrl!],
    ["Spaceship", spaceshipUrl!],
  ];

  for (const [key, path] of entries) {
    models[key] = await Model(path);
  }
};
