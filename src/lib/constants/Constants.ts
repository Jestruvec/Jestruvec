const CAMERA_SETTINGS = {
  fov: 75,
  near: 0.1,
  far: 1000,
  aspectRatio: window.innerWidth / window.innerHeight,
  position: { x: -10, y: 10, z: 15 },
  lookAt: { x: 0, y: 10, z: 0 },
};

const ANIMAL_MODELS = [
  "Alpaca.glb",
  "Bull.glb",
  "Cow.glb",
  "Deer.glb",
  "Donkey.glb",
  "Fox.glb",
  "Horse.glb",
  "Husky.glb",
  "Shiba-Inu.glb",
  "Stag.glb",
  "White-Horse.glb",
  "Wolf.glb",
].map((model) => `/glb_models/${model}`);

export { CAMERA_SETTINGS, ANIMAL_MODELS };
