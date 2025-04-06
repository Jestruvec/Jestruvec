import * as THREE from "three";

export const useLights = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);

  const createDirLight = (group: THREE.Group) => {
    const dirLight = new THREE.DirectionalLight();
    dirLight.position.set(0, 10, 0);
    dirLight.target = group;

    return dirLight;
  };

  const createSpotLight = () => {
    const spotlight = new THREE.SpotLight(
      0xffffff, // Color blanco puro
      5, // Intensidad fuerte (valor alto, por defecto es 1)
      20, // Distancia grande para cubrir más área
      Math.PI / 2, // Ángulo más abierto (60 grados en radianes)
      0.2, // Penumbra más pequeña (bordes más definidos)
      1 // Decay (atenúa la luz con la distancia)
    );

    spotlight.position.set(0, 5, 5); // Posición en el techo (5 unidades de altura)
    spotlight.lookAt(0, 0, -5); // Posición en el techo (5 unidades de altura)
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
