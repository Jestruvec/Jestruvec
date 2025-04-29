import "@/assets/styles/index.css";
import { sceneSetup, setupAudio } from "@/lib/scene/";
import { loadModels, initEventListeners, updateCamera } from "@/lib/helpers";
import { Character } from "@/lib/character";
import { map, initMap } from "@/lib/map/map";

export const main = async () => {
  await loadModels();
  initEventListeners();
  setupAudio();
  const { renderer, scene, camera, clock } = sceneSetup();

  initMap();

  const character = await Character.create("Astronaut");

  scene.add(character.model);

  const animate = () => {
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    updateCamera(character.model.position, camera);
    character.update(delta);
    map.update(elapsed, delta);

    renderer.render(scene, camera);
  };

  renderer.setAnimationLoop(animate);
};

main();
