import * as THREE from "three";
import { createMesh } from "@/lib/helpers/createMesh";
import { Palm_1, Ship, Rock_1 } from "@/assets/glbs";
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
  const size = 50;
  const half = size / 2;

  const ship = await Model(Ship);
  ship.model.position.set(0, 0, 15);
  scene.add(ship.model);

  const palmModel = await Model(Palm_1);
  const rocksModel = await Model(Rock_1);

  for (let x = -half; x < half; x++) {
    for (let z = -half; z < half; z++) {
      const key = `${x},${z}`;
      if (!generatedTiles.has(key)) {
        const isWater = z >= 10;
        const material = isWater ? waterMaterial : sandMaterial;

        const tile = Box(tileSize, tileSize, 0.25, material);
        tile.rotation.x = -Math.PI / 2;
        tile.position.set(x, -0.125, z);
        scene.add(tile);
        generatedTiles.add(key);

        // palmas aleatorias 5% de probabilidad
        if (z <= 0 && Math.random() < 0.05) {
          const palm = palmModel.model.clone();
          palm.position.set(
            x + 0.5 - Math.random(),
            0,
            z + 0.5 - Math.random()
          );
          palm.rotation.y = Math.random() * Math.PI * 2;
          const scale = 0.8 + Math.random() * 0.4;
          palm.scale.set(scale, scale, scale);
          scene.add(palm);

          const rocks = rocksModel.model.clone();
          rocks.position.set(x - Math.random(), 0, z - Math.random());
          scene.add(rocks);
        }

        if (z <= 0 && Math.random() < 0.05) {
          const rocks = rocksModel.model.clone();
          rocks.position.set(x - Math.random(), 0, z - Math.random());
          scene.add(rocks);
        }
      }
    }
  }
};
