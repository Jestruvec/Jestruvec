import * as THREE from "three";

export const useLights = () => {
  const ambientLight = new THREE.AmbientLight();

  const createDirLight = (player: THREE.Group) => {
    const dirLight = new THREE.DirectionalLight();
    dirLight.position.set(-100, -100, 200);
    dirLight.target = player;

    return dirLight;
  };

  return { ambientLight, createDirLight };
};
