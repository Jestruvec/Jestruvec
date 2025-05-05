import * as THREE from "three";
import { BaseEntity } from "@/lib/games/baseEntity";
import { CHARACTER_SPEED } from "@/lib/constants/character";

export class Astronaut extends BaseEntity {
  private direction = new THREE.Vector3();
  private forward = new THREE.Vector3();
  private right = new THREE.Vector3();
  private up = new THREE.Vector3(0, 1, 0);
  private getEffectiveKeys: () => Set<string>;

  constructor(getEffectiveKeys: () => Set<string>) {
    super("Astronaut", (rawName: string) =>
      rawName.replace("CharacterArmature|", "")
    );

    this.getEffectiveKeys = getEffectiveKeys;
  }

  update(delta: number, camera: THREE.Camera): void {
    this.updatePosition(delta, camera);
    this.mixer.update(delta);
  }

  updatePosition = (delta: number, camera: THREE.Camera) => {
    this.direction.set(0, 0, 0);
    this.forward.set(0, 0, 0);
    this.right.set(0, 0, 0);

    camera.getWorldDirection(this.forward);
    this.forward.y = 0;
    this.forward.normalize();

    this.right.crossVectors(this.forward, this.up).normalize();

    const keysPressed = this.getEffectiveKeys();

    if (keysPressed.has("w") || keysPressed.has("arrowup"))
      this.direction.add(this.forward);
    if (keysPressed.has("s") || keysPressed.has("arrowdown"))
      this.direction.sub(this.forward);
    if (keysPressed.has("a") || keysPressed.has("arrowleft"))
      this.direction.sub(this.right);
    if (keysPressed.has("d") || keysPressed.has("arrowright"))
      this.direction.add(this.right);

    this.direction.normalize();

    this.model.position.addScaledVector(
      this.direction,
      delta * CHARACTER_SPEED
    );

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
  };
}
