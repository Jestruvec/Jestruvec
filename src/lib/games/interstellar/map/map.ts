import * as THREE from "three";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { Water } from "three/examples/jsm/objects/Water.js";
import { SUN_ROTATION_SPEED } from "@/lib/constants";
import WaterNormalTexture from "@/assets/textures/water.webp";

const mapFabric = (scene: THREE.Scene) => {
  const floorGeometry = new THREE.PlaneGeometry(500, 500);
  const waterNormalMap = new THREE.TextureLoader().load(
    WaterNormalTexture,
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  );

  const water = new Water(floorGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: waterNormalMap,
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 4.0,
    fog: true,
  });

  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.5;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);

  const sky = new Sky();
  sky.scale.setScalar(450000);

  const sun = new THREE.Vector3();
  const uniforms = sky.material.uniforms;
  uniforms["turbidity"].value = 10;
  uniforms["rayleigh"].value = 2;
  uniforms["mieCoefficient"].value = 0.005;
  uniforms["mieDirectionalG"].value = 0.8;

  const phi = THREE.MathUtils.degToRad(90 - 10);
  const theta = THREE.MathUtils.degToRad(180);
  sun.setFromSphericalCoords(1, phi, theta);
  uniforms["sunPosition"].value.copy(sun);

  const sunLight = new THREE.DirectionalLight(0xffffff, 1);
  sunLight.position.copy(sun).multiplyScalar(100);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 250;
  sunLight.shadow.camera.left = -50;
  sunLight.shadow.camera.right = 50;
  sunLight.shadow.camera.top = 50;
  sunLight.shadow.camera.bottom = -50;

  const radius = 200;

  scene.add(ambientLight, sunLight, sky, water);

  const update = (elapsed: number) => {
    const angle = elapsed * SUN_ROTATION_SPEED;

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = 10;

    sunLight.position.set(x, y, z);
    uniforms["sunPosition"].value.set(x, y, z);
    sun.set(x, y, z);

    const waterSpeed = 0.25;
    water.material.uniforms["time"].value = elapsed * waterSpeed;
  };

  return { update };
};

export let map: ReturnType<typeof mapFabric>;
export const createMap = (scene: THREE.Scene) => {
  map = mapFabric(scene);
  return map;
};
