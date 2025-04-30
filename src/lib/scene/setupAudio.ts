import * as THREE from "three";
import { getPublicUrl } from "@/lib/services";

export const setupAudio = () => {
  const listener = new THREE.AudioListener();

  const backgroundMusic = getPublicUrl("music", "Background.mp3");
  const backgroundSound = new THREE.Audio(listener);

  const audioLoader = new THREE.AudioLoader();

  //arreglar el uso de '!'
  audioLoader.load(backgroundMusic!, (buffer) => {
    backgroundSound.setBuffer(buffer);
    backgroundSound.setLoop(true);
    backgroundSound.setVolume(0.5);
  });

  return {
    backgroundSound,
    listener,
  };
};
