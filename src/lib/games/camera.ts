import * as THREE from "three";
import { CAMERA_DISTANCE, CAMERA_HEIGHT } from "@/lib/constants";

export class CustomCamera extends THREE.PerspectiveCamera {
  private horizontalAngle = Math.PI + 1;
  private sensitivity = 0.01;

  update(position: THREE.Vector3, mouseDeltaX: number) {
    this.horizontalAngle -= mouseDeltaX * this.sensitivity;

    const cameraX =
      position.x + Math.sin(this.horizontalAngle) * CAMERA_DISTANCE;
    const cameraY = position.y * CAMERA_DISTANCE + CAMERA_HEIGHT;
    const cameraZ =
      position.z + Math.cos(this.horizontalAngle) * CAMERA_DISTANCE;

    this.position.set(cameraX, cameraY, cameraZ);
    this.lookAt(position.x, position.y, position.z);
  }
}
