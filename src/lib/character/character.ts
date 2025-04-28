import * as THREE from "three";
import { getModel, ModelKey, keysPressed } from "@/lib/helpers";
import { sceneSetup } from "@/lib/scene/sceneSetup";
import { CHARACTER_SPEED } from "../constants/character";

export type CharacterAnimation =
  | "Death"
  | "Gun_Shoot"
  | "HitRecieve"
  | "HitRecieve_2"
  | "Idle"
  | "Idle_Gun"
  | "Idle_Gun_Pointing"
  | "Idle_Gun_Shoot"
  | "Idle_Neutral"
  | "Idle_Sword"
  | "Interact"
  | "Kick_Left"
  | "Kick_Right"
  | "Punch_Right"
  | "Punch_Left"
  | "Roll"
  | "Run"
  | "Run_Back"
  | "Run_Left"
  | "Run_Right"
  | "Run_Shoot"
  | "Sword_Slash"
  | "Walk"
  | "Wave";

const { camera } = sceneSetup();

export class Character {
  model: THREE.Group;
  mixer: THREE.AnimationMixer;
  animations: Record<CharacterAnimation, THREE.AnimationAction>;
  currentAction: THREE.AnimationAction | null = null;
  direction = new THREE.Vector3();
  forward = new THREE.Vector3();
  right = new THREE.Vector3();
  up = new THREE.Vector3(0, 1, 0);

  private constructor(model: THREE.Group, animations: THREE.AnimationClip[]) {
    this.model = model;
    this.mixer = new THREE.AnimationMixer(model);
    this.animations = {} as Record<CharacterAnimation, THREE.AnimationAction>;

    animations.forEach((clip) => {
      const cleanName = this.cleanAnimationName(
        clip.name
      ) as CharacterAnimation;
      this.animations[cleanName] = this.mixer.clipAction(clip);
    });
  }

  static async create(key: ModelKey): Promise<Character> {
    const { model, animations } = getModel(key);
    return new Character(model, animations);
  }

  private cleanAnimationName(name: string): string {
    return name.replace("CharacterArmature|", "");
  }

  update(delta: number) {
    this.updatePosition(delta);
    this.mixer.update(delta);
  }

  playAnimation(
    name: CharacterAnimation,
    clamp: boolean = false,
    once: boolean = false,
    reset: boolean = false
  ) {
    if (this.currentAction) {
      this.currentAction.fadeOut(0.2);
    }

    const action = this.animations[name];
    if (action) {
      action.clampWhenFinished = clamp;

      if (once) {
        action.setLoop(THREE.LoopOnce, 1);
      }

      if (reset) {
        action.reset();
      }

      action.play();
    }
  }

  stopAnimation(name: CharacterAnimation) {
    if (this.currentAction) {
      this.currentAction.fadeOut(0.2);
    }

    const action = this.animations[name];
    if (action) {
      action.stop();
    }
  }

  setPosition(x: number, y: number, z: number) {
    this.model.position.set(x, y, z);
  }

  lookAt(target: THREE.Vector3) {
    this.model.lookAt(target);
  }

  updatePosition = (delta: number) => {
    this.direction.set(0, 0, 0);
    this.forward.set(0, 0, 0);
    this.right.set(0, 0, 0);

    camera.getWorldDirection(this.forward);
    this.forward.y = 0;
    this.forward.normalize();

    this.right.crossVectors(this.forward, this.up).normalize();

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
