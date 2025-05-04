import * as THREE from "three";
import { getModel, ModelKey } from "@/lib/helpers";

export class BaseEntity {
  model: THREE.Group;
  mixer: THREE.AnimationMixer;
  animations: Record<string, THREE.AnimationAction>;
  currentAction: THREE.AnimationAction | null = null;

  protected constructor(
    key: ModelKey,
    cleanAnimationName: (rawName: string) => string
  ) {
    const { model, animations, mixer } = getModel(key);

    this.model = model;
    this.mixer = mixer;
    this.animations = {};

    animations.forEach((clip) => {
      const cleanName = cleanAnimationName(clip.name);
      this.animations[cleanName] = this.mixer.clipAction(clip);
    });
  }

  update(delta: number) {
    this.mixer.update(delta);
  }

  playAnimation(
    name: string,
    clamp: boolean = false,
    once: boolean = false,
    reset: boolean = false
  ) {
    const action = this.animations[name];

    if (action) {
      //si ya esta en idle, no volver a llamar a la fn
      if (name === "Idle_Neutral" && this.currentAction === action) return;

      action.clampWhenFinished = clamp;

      if (once) action.setLoop(THREE.LoopOnce, 1);
      if (reset) action.reset();

      action.play();
      this.currentAction = action;
    }
  }

  stopAnimation(name: string) {
    const action = this.animations[name];
    if (action) {
      action.stop();
      if (this.currentAction === action) this.currentAction = null;
    }
  }
}
