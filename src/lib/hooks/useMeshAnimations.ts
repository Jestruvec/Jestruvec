import * as THREE from "three";
import { useCallback } from "react";
import { AnimatedModel } from "../types/AnimatedModel";

export const useMeshAnimations = () => {
  const getAnimationAction = useCallback(
    (model: AnimatedModel, clipName: string) => {
      const clip = model.animations.find((e) => e.name === clipName);
      return clip ? model.mixer.clipAction(clip) : null;
    },
    []
  );

  const startAnimation = useCallback((action: THREE.AnimationAction) => {
    if (!action.isRunning()) {
      action.reset().play();
    }
  }, []);

  const stopAnimation = useCallback((action: THREE.AnimationAction) => {
    if (action.isRunning()) {
      action.stop();
    }
  }, []);

  return {
    getAnimationAction,
    startAnimation,
    stopAnimation,
  };
};
