import * as THREE from "three";
import { RoundedBoxGeometry, GLTF, GLTFLoader } from "three-stdlib";

export const useMesh = () => {
  const loader = new GLTFLoader();
  const defaultMaterial = new THREE.MeshLambertMaterial({
    color: "white",
    flatShading: true,
  });

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

  const createBox = (
    x: number,
    y: number,
    z: number,
    material: THREE.MeshLambertMaterial = defaultMaterial
  ) => {
    return new THREE.Mesh(new THREE.BoxGeometry(x, y, z), material);
  };

  const createRoundedBox = (
    x: number,
    y: number,
    z: number,
    segments: number,
    radius: number,
    material: THREE.MeshLambertMaterial
  ) => {
    const geometry = new RoundedBoxGeometry(x, y, z, segments, radius);
    return new THREE.Mesh(geometry, material);
  };

  const createCilinder = (
    radioTop: number,
    radioBottom: number,
    height: number,
    radialSegments: number,
    material: THREE.MeshLambertMaterial
  ) => {
    return new THREE.Mesh(
      new THREE.CylinderGeometry(radioTop, radioBottom, height, radialSegments),
      material
    );
  };

  const createSphere = (
    radius: number,
    widthSegments: number,
    heightSegments: number,
    material: THREE.MeshLambertMaterial
  ) => {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, widthSegments, heightSegments),
      material
    );
  };

  const createPlane = (
    width: number,
    height: number,
    widthSegments: number,
    heightSegments: number,
    material: THREE.MeshLambertMaterial = defaultMaterial
  ) => {
    return new THREE.Mesh(
      new THREE.PlaneGeometry(width, height, widthSegments, heightSegments),
      material
    );
  };

  const createTorus = (
    radius: number,
    tube: number,
    radialSegments: number,
    tubularSegments: number,
    material: THREE.MeshLambertMaterial
  ) => {
    return new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments),
      material
    );
  };

  const createRing = (
    innerRadius: number,
    outerRadius: number,
    thetaSegments: number,
    material: THREE.MeshLambertMaterial
  ) => {
    return new THREE.Mesh(
      new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments),
      material
    );
  };

  return {
    createModel,
    createBox,
    createRoundedBox,
    createCilinder,
    createSphere,
    createPlane,
    createTorus,
    createRing,
  };
};
