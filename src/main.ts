import "@/assets/styles/index.css";
import { loadModels } from "@/lib/helpers";
import { initEventListeners } from "@/lib/events";
import { Astronaut, Spaceship, sceneSetup, createMap } from "@/lib/game/";

export const main = async () => {
  const { renderer, scene, camera, clock } = sceneSetup();
  const { map } = createMap();

  const animate = () => {
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();
    const characterPosition = character.model.position;

    map.update(elapsed);
    camera.update(characterPosition);
    character.update(delta);
    spaceship.update(delta);

    renderer.render(scene, camera);
  };

  await loadModels();
  const character = new Astronaut();
  const spaceship = new Spaceship();
  spaceship.model.rotation.y = Math.PI;
  spaceship.model.position.set(10, 5, 40);

  scene.add(character.model, spaceship.model);

  renderer.setAnimationLoop(animate);
  initEventListeners();
};

main();
