import * as THREE from "three";
import { BaseEntity } from "@/lib/games/baseEntity";
import { CHARACTER_SPEED } from "@/lib/constants/character";

export class Astronaut extends BaseEntity {
  private direction = new THREE.Vector3();
  private forward = new THREE.Vector3();
  private right = new THREE.Vector3();
  private up = new THREE.Vector3(0, 1, 0);
  private getEffectiveKeys: () => Set<string>;
  // private obstacles: THREE.Box3[] = [];
  // private collider = new THREE.Mesh(
  //   new THREE.BoxGeometry(1, 4, 1),
  //   new THREE.MeshBasicMaterial({
  //     color: 0x00ff00,
  //     wireframe: true,
  //   })
  // );

  constructor(getEffectiveKeys: () => Set<string>) {
    const cleanAnimationName = (rawName: string) => {
      return rawName.replace("CharacterArmature|", "");
    };

    super("Astronaut", cleanAnimationName);

    // this.model.add(this.collider);
    this.getEffectiveKeys = getEffectiveKeys;
  }

  update(delta: number, camera: THREE.Camera): void {
    this.updatePosition(delta, camera);
    this.mixer.update(delta);
  }

  // setObstacles(obstacles: THREE.Box3[]) {
  //   this.obstacles = obstacles;
  // }

  updatePosition = (delta: number, camera: THREE.Camera) => {
    this.resetVectors();
    this.computeDirections(camera);
    this.handleInput();

    this.direction.normalize();

    const newPosition = this.getNextPosition(delta);
    // const willCollide = this.checkCollision(newPosition);

    // if (!willCollide) {
    //   this.model.position.copy(newPosition);
    // }

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

  // private checkCollision(newPosition: THREE.Vector3): boolean {
  //   const characterBox = new THREE.Box3().setFromObject(this.collider);
  //   const offset = new THREE.Vector3().subVectors(
  //     newPosition,
  //     this.model.position
  //   );
  //   const futureBox = characterBox.clone().translate(offset);

  //   for (const obs of this.obstacles) {
  //     if (futureBox.intersectsBox(obs)) {
  //       return true;
  //     }
  //   }

  //   return false;
  // }

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
