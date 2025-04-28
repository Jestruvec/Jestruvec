import * as THREE from "three";
import { CAMERA_DISTANCE, CAMERA_HEIGHT } from "@/lib/constants";
import { mouseDeltaX } from "@/lib/helpers";

let horizontalAngle = Math.PI + 1;

const sensitivity = 0.01;

export const updateCamera = (position: THREE.Vector3, camera: THREE.Camera) => {
  horizontalAngle -= mouseDeltaX * sensitivity;

  const cameraX = position.x + Math.sin(horizontalAngle) * CAMERA_DISTANCE;
  const cameraY = position.y * CAMERA_DISTANCE + CAMERA_HEIGHT;
  const cameraZ = position.z + Math.cos(horizontalAngle) * CAMERA_DISTANCE;

  camera.position.set(cameraX, cameraY, cameraZ);
  camera.lookAt(position.x, position.y, position.z);
};
