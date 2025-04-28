import * as THREE from "three";
import backgroundMusic from "@/assets/music/Background.mp3";

export const setupAudio = () => {
  const listener = new THREE.AudioListener();

  const backgroundSound = new THREE.Audio(listener);

  const audioLoader = new THREE.AudioLoader();

  audioLoader.load(backgroundMusic, (buffer) => {
    backgroundSound.setBuffer(buffer);
    backgroundSound.setLoop(true);
    backgroundSound.setVolume(0.5);
    backgroundSound.play();
  });

  return {
    backgroundSound,
    listener,
  };
};
