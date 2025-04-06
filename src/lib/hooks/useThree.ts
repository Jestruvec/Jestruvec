import * as THREE from "three";
import { CAMERA_SETTINGS } from "@/lib/constants/Constants";
import { GLTF, GLTFLoader, OrbitControls } from "three-stdlib";

export const useThree = () => {
  const scene = new THREE.Scene();
  const clock = new THREE.Clock();
  const loader = new GLTFLoader();

  const createRenderer = (canvas: HTMLCanvasElement) => {
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: canvas,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    return renderer;
  };

  const createCamera = () => {
    const { fov, aspectRatio, near, far, lookAt, position } = CAMERA_SETTINGS;

    const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);

    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(lookAt.x, lookAt.y, lookAt.z);

    return camera;
  };

  const createOrbitControls = (
    camera: THREE.PerspectiveCamera,
    domElement: HTMLCanvasElement
  ) => {
    const controls = new OrbitControls(camera, domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    return controls;
  };

  const createModel = async (
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

  return {
    scene,
    clock,
    createRenderer,
    createCamera,
    createOrbitControls,
    createModel,
  };
};
