import * as THREE from "three";

export function followPirate(camera: THREE.Camera, target: THREE.Object3D) {
  const offset = new THREE.Vector3(0, 5, -5);
  const targetPosition = target.position.clone().add(offset);

  camera.position.lerp(targetPosition, 0.1);
  camera.lookAt(target.position);
}
