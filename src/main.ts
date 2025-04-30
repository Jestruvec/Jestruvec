import "@/assets/styles/index.css";
import { sceneSetup } from "@/lib/scene/";
import {
  loadModels,
  initEventListeners,
  updateCamera,
  getModel,
} from "@/lib/helpers";
import { Character } from "@/lib/character";
import { map, initMap } from "@/lib/map/map";

export const main = async () => {
  const { renderer, scene, camera, clock } = sceneSetup();
  initMap();
  let modelsReady = false;

  const animate = () => {
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    map.update(elapsed);

    if (modelsReady) {
      updateCamera(character.model.position, camera);
      character.update(delta);
      spaceship.update(delta);
    }

    renderer.render(scene, camera);
  };

  renderer.setAnimationLoop(animate);
  await loadModels();
  initEventListeners();

  const character = await Character.create("Astronaut");
  const spaceship = getModel("Spaceship");
  spaceship.model.rotation.y = Math.PI;
  spaceship.model.position.set(10, 5, 40);

  scene.add(character.model, spaceship.model);
  modelsReady = true;
};

main();
