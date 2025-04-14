import * as THREE from "three";
import { createMesh } from "@/lib/helpers/createMesh";
import { ChunkCoord } from "../types";

export const handleChunks = () => {
  const getChunkCoords = (x: number, z: number, chunkSize = 10): ChunkCoord => {
    const chunkX = Math.floor(x / chunkSize);
    const chunkZ = Math.floor(z / chunkSize);
    return `${chunkX},${chunkZ}`;
  };

  const generateChunk = async (
    scene: THREE.Scene,
    chunkX: number,
    chunkZ: number,
    tileSize = 1,
    chunkSize = 10
  ) => {
    const { Box } = createMesh();
    const sandMaterial = new THREE.MeshLambertMaterial({
      color: 0xdeb887,
      flatShading: true,
    });

    for (let x = 0; x < chunkSize; x++) {
      for (let z = 0; z < chunkSize; z++) {
        const worldX = (chunkX * chunkSize + x) * tileSize;
        const worldZ = (chunkZ * chunkSize + z) * tileSize;

        const tile = Box(tileSize, tileSize, 0.25, sandMaterial);
        tile.rotation.x = -Math.PI / 2;
        tile.position.set(worldX, 0, worldZ);
        scene.add(tile);
      }
    }
  };

  return { getChunkCoords, generateChunk };
};
