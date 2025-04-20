import * as THREE from "three";
import { createMesh } from "@/lib/helpers/createMesh";
import { Palm_1, Ship, Rock_1, Chest_Gold, Gold_Bag } from "@/assets/glbs";
const { Box, Model } = createMesh();

const sandMaterial = new THREE.MeshLambertMaterial({ color: 0xdeb887 });
const waterMaterial = new THREE.MeshStandardMaterial({
  color: 0x1e90ff, // un azul tipo océano
  transparent: true,
  opacity: 0.8,
  roughness: 0.5,
  metalness: 0.3,
});

const generatedTiles = new Set<string>();
const tileSize = 1; // cada tile es 1x1

export const updateMapOnMove = (scene: THREE.Scene, player: THREE.Object3D) => {
  const { x, z } = player.position;
  const px = Math.floor(x);
  const pz = Math.floor(z);
  const range = 1; // cuántos tiles alrededor generar

  for (let dx = -range; dx <= range; dx++) {
    for (let dz = -range; dz <= range; dz++) {
      const tx = px + dx;
      const tz = pz + dz;
      const key = `${tx},${tz}`;

      if (!generatedTiles.has(key)) {
        const tile = Box(tileSize, tileSize, 0.25, sandMaterial);
        tile.rotation.x = -Math.PI / 2;
        tile.position.set(tx, -0.125, tz);
        scene.add(tile);
        generatedTiles.add(key);
      }
    }
  }
};

export const initMap = async (scene: THREE.Scene) => {
  const size = 100;
  const half = size / 2;

  // Carga los modelos
  const ship = await Model(Ship);
  ship.model.position.set(0, 0, 35);

  const palmModel = await Model(Palm_1);
  const rocksModel = await Model(Rock_1);
  const chest_Gold = await Model(Chest_Gold);
  chest_Gold.model.position.set(0, 0, 0);
  chest_Gold.model.rotation.y = Math.PI;

  const chestPos = chest_Gold.model.position.clone();
  const bagOffset = 1.2;
  const bagsAround = [
    new THREE.Vector3(1, 0, 0), // derecha
    new THREE.Vector3(-1, 0, 0), // izquierda
    new THREE.Vector3(0, 0, 1), // atrás
    new THREE.Vector3(0, 0, -1), // adelante
    new THREE.Vector3(1, 0, 1), // diagonal
    new THREE.Vector3(-1, 0, -1), // diagonal
  ];

  // Añade las bolsas de oro alrededor del cofre
  for (const offset of bagsAround) {
    const goldBag = await Model(Gold_Bag);
    goldBag.model.position.copy(
      chestPos.clone().add(offset.multiplyScalar(bagOffset))
    );
    goldBag.model.rotation.y = Math.PI;
    scene.add(goldBag.model);
  }

  // Añade el barco y el cofre al escenario
  scene.add(ship.model, chest_Gold.model);

  // Crea un InstancedMesh para los tiles
  const tileGeometry = new THREE.BoxGeometry(tileSize, tileSize, 0.25);
  const sandInstanced = new THREE.InstancedMesh(
    tileGeometry,
    sandMaterial,
    size * size
  );
  const waterInstanced = new THREE.InstancedMesh(
    tileGeometry,
    waterMaterial,
    size * size
  );
  scene.add(sandInstanced);
  scene.add(waterInstanced);

  // Crear los tiles en instancias
  let index = 0;
  for (let x = -half; x < half; x++) {
    for (let z = -half; z < half; z++) {
      const key = `${x},${z}`;
      if (!generatedTiles.has(key)) {
        const distanceFromCenter = Math.sqrt(x * x + z * z);
        const isWater = distanceFromCenter > half * 0.5;
        const targetInstancedMesh = isWater ? waterInstanced : sandInstanced;

        const matrix = new THREE.Matrix4();
        matrix.makeTranslation(x, -0.125, z);
        matrix.multiply(new THREE.Matrix4().makeRotationX(-Math.PI / 2)); // Rota el tile sobre el eje X
        targetInstancedMesh.setMatrixAt(index++, matrix);

        generatedTiles.add(key);
      }
    }
  }

  // Añade palmeras y rocas cerca del centro, con mayor probabilidad a medida que te alejas
  const maxPalmDistance = 5;
  const maxRockDistance = 5;

  for (let x = -half; x < half; x++) {
    for (let z = -half; z < half; z++) {
      const distanceFromCenter = Math.sqrt(x * x + z * z);
      const isWater = distanceFromCenter > half * 0.5;

      if (
        !isWater &&
        distanceFromCenter > maxPalmDistance &&
        Math.random() < 0.05
      ) {
        // Crear palmera solo si está cerca
        const palm = palmModel.model.clone();
        palm.position.set(x + 0.5 - Math.random(), 0, z + 0.5 - Math.random());
        palm.rotation.y = Math.random() * Math.PI * 2;
        const scale = 0.8 + Math.random() * 0.4;
        palm.scale.set(scale, scale, scale);
        scene.add(palm);
      }

      if (
        !isWater &&
        distanceFromCenter > maxRockDistance &&
        Math.random() < 0.025
      ) {
        // Crear roca solo si está cerca
        const rocks = rocksModel.model.clone();
        rocks.position.set(x - Math.random(), 0, z - Math.random());
        scene.add(rocks);
      }
    }
  }

  console.log(scene.children.length);
};
