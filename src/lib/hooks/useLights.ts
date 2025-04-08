import * as THREE from "three";

export const useLights = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);

  const createDirLight = (group: THREE.Group) => {
    const dirLight = new THREE.DirectionalLight();
    dirLight.target = group;

    return dirLight;
  };

  const createSpotLight = () => {
    const spotlight = new THREE.SpotLight(
      0xffffff, // Color blanco
      10, // Intensidad  (por defecto es 1)
      20, // Distancia para cubrir más área
      Math.PI, // Ángulo
      0.2, // Penumbra
      1 // Decay (atenúa la luz con la distancia)
    );

    spotlight.castShadow = true;

    // Ajustes de sombra para mejor calidad
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    spotlight.shadow.camera.near = 0.5;
    spotlight.shadow.camera.far = 20;

    return spotlight;
  };

  return { ambientLight, createDirLight, createSpotLight };
};
