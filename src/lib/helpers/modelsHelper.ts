import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import { GLTF, GLTFLoader } from "three-stdlib";
import { AnimatedModel } from "@/lib/types";
import * as Models from "@/assets/models";

export type ModelKey =
  | "Astronaut"
  | "Outer_Space"
  | "Astronaut_Reptile"
  | "Lander"
  | "Lander_2"
  | "Cargo_Depot"
  | "Black_Hole"
  | "Spaceship";

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
      (gltf: GLTF) => {
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
          update: (delta: number) => {
            if (mixer) {
              mixer.update(delta);
            }
          },
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

  const modelClone = clone(original.model);
  const mixer = new THREE.AnimationMixer(modelClone);

  return {
    model: modelClone,
    animations: original.animations,
    mixer,
    update: (delta: number) => mixer.update(delta),
  };
};

export const loadModels = async () => {
  const entries: [ModelKey, string][] = [
    ["Astronaut", Models.Astronaut],
    ["Outer_Space", Models.Outer_Space],
    ["Astronaut_Reptile", Models.Astronaut_Reptile],
    ["Lander", Models.Lander],
    ["Lander_2", Models.Lander_2],
    ["Cargo_Depot", Models.Cargo_Depot],
    ["Black_Hole", Models.Black_Hole],
    ["Spaceship", Models.Spaceship],
  ];

  for (const [key, path] of entries) {
    models[key] = await Model(path);
  }
};
