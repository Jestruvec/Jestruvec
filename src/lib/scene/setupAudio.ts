import * as THREE from "three";
import jungle_night from "@/assets/sounds/jungle_night.mp3";
import sword from "@/assets/sounds/sword.mp3";
import character_death from "@/assets/sounds/character_death.mp3";
import hit from "@/assets/sounds/cinematic-hit.mp3";

export const setupAudio = (camera: THREE.Camera) => {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  const oceanSound = new THREE.Audio(listener);
  const swordSound = new THREE.Audio(listener);
  const deathSound = new THREE.Audio(listener);
  const hitSound = new THREE.Audio(listener);

  const audioLoader = new THREE.AudioLoader();

  // Sonido del mar
  audioLoader.load(jungle_night, (buffer) => {
    oceanSound.setBuffer(buffer);
    oceanSound.setLoop(true);
    oceanSound.setVolume(0.5);
    oceanSound.play();
  });

  // Sonido de espada
  audioLoader.load(sword, (buffer) => {
    swordSound.setBuffer(buffer);
    swordSound.setLoop(false);
    swordSound.setVolume(0.7);
  });

  // Sonido de espada
  audioLoader.load(character_death, (buffer) => {
    deathSound.setBuffer(buffer);
    deathSound.setLoop(false);
  });

  audioLoader.load(hit, (buffer) => {
    hitSound.setBuffer(buffer);
    hitSound.setLoop(false);
  });

  // Reanudar AudioContext al hacer clic
  window.addEventListener("click", () => {
    const audioContext = THREE.AudioContext.getContext();

    if (audioContext.state === "suspended") {
      audioContext.resume().then(() => {
        console.log("AudioContext resumed successfully.");
      });
    }
  });

  return { oceanSound, swordSound, deathSound, hitSound };
};
