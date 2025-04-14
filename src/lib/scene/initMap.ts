import * as THREE from "three";
import { createMesh } from "@/lib/helpers/createMesh";
const { Box } = createMesh();

const sandMaterial = new THREE.MeshLambertMaterial({ color: 0xdeb887 });

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
  const dummyPlayer = new THREE.Object3D();
  dummyPlayer.position.set(0, 0, 0);

  const size = 1;
  const half = size / 2;

  for (let x = -half; x < half; x++) {
    for (let z = -half; z < half; z++) {
      const key = `${x},${z}`;
      if (!generatedTiles.has(key)) {
        const tile = Box(tileSize, tileSize, 0.25, sandMaterial);
        tile.rotation.x = -Math.PI / 2;
        tile.position.set(x, -0.125, z);
        scene.add(tile);
        generatedTiles.add(key);
      }
    }
  }

  updateMapOnMove(scene, dummyPlayer);
};
