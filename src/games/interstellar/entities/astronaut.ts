import * as THREE from "three";
import { BaseEntity } from "@/games/baseEntity";
import { CHARACTER_SPEED } from "@/constants/character";

export class Astronaut extends BaseEntity {
  private direction = new THREE.Vector3();
  private forward = new THREE.Vector3();
  private right = new THREE.Vector3();
  private up = new THREE.Vector3(0, 1, 0);
  private getEffectiveKeys: () => Set<string>;

  constructor(getEffectiveKeys: () => Set<string>) {
    const cleanAnimationName = (rawName: string) => {
      return rawName.replace("CharacterArmature|", "");
    };

    super("Astronaut", cleanAnimationName);

    this.getEffectiveKeys = getEffectiveKeys;
  }

  update(delta: number, camera: THREE.Camera): void {
    this.updatePosition(delta, camera);
    this.mixer.update(delta);
  }

  updatePosition = (delta: number, camera: THREE.Camera) => {
    this.resetVectors();
    this.computeDirections(camera);
    this.handleInput();
    this.direction.normalize();

    const newPosition = this.getNextPosition(delta);
    this.model.position.copy(newPosition);
    this.updateAnimationAndRotation();
  };

  private resetVectors() {
    this.direction.set(0, 0, 0);
    this.forward.set(0, 0, 0);
    this.right.set(0, 0, 0);
  }

  private computeDirections(camera: THREE.Camera) {
    camera.getWorldDirection(this.forward);
    this.forward.y = 0;
    this.forward.normalize();

    this.right.crossVectors(this.forward, this.up).normalize();
  }

  private handleInput() {
    const keysPressed = this.getEffectiveKeys();

    if (keysPressed.has("w") || keysPressed.has("arrowup"))
      this.direction.add(this.forward);
    if (keysPressed.has("s") || keysPressed.has("arrowdown"))
      this.direction.sub(this.forward);
    if (keysPressed.has("a") || keysPressed.has("arrowleft"))
      this.direction.sub(this.right);
    if (keysPressed.has("d") || keysPressed.has("arrowright"))
      this.direction.add(this.right);
  }

  private getNextPosition(delta: number): THREE.Vector3 {
    return this.model.position
      .clone()
      .addScaledVector(this.direction, delta * CHARACTER_SPEED);
  }

  private updateAnimationAndRotation() {
    const isMoving = this.direction.lengthSq() > 0;

    if (isMoving) {
      const targetRotation = Math.atan2(this.direction.x, this.direction.z);
      this.model.rotation.y += (targetRotation - this.model.rotation.y) * 0.1;

      this.stopAnimation("Idle_Neutral");
      this.playAnimation("Walk");
    } else {
      this.stopAnimation("Walk");
      this.playAnimation("Idle_Neutral");
    }
  }
}
