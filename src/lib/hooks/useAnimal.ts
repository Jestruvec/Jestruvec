import * as THREE from "three";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export const useAnimal = () => {
  const loader = new GLTFLoader();
  let mixer: THREE.AnimationMixer | null = null;

  const createAnimal = async (
    modelPath: string
  ): Promise<{
    model: THREE.Group;
    update: (delta: number) => void;
  }> => {
    return new Promise((resolve, reject) => {
      loader.load(
        modelPath,
        (gltf: GLTF) => {
          const model = gltf.scene as THREE.Group;
          const animations = gltf.animations;

          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
            }
          });

          mixer = new THREE.AnimationMixer(model);

          const walkClip = animations.find((clip) => clip.name === "Walk");
          if (walkClip) {
            const action = mixer.clipAction(walkClip);
            action.play();
          }

          // modelo y función para actualizar animaciones
          resolve({
            model,
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

  return { createAnimal };
};
