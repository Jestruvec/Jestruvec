import * as THREE from "three";
import { Game } from "@/lib/games/game";
import { Astronaut } from "./entities/astronaut";
import { Spaceship } from "./entities/spaceship";
import { createMap } from "./map/map";
import { getPublicUrl } from "@/lib/services";
import { loadModels } from "@/lib/helpers";

export class Interstellar extends Game {
  astronaut!: Astronaut;
  spaceship!: Spaceship;
  map = createMap(this.scene);

  private constructor(canvas: HTMLCanvasElement, joystick: HTMLDivElement) {
    const camInitialPosition = new THREE.Vector3(0, 0, 0);
    super(canvas, joystick, camInitialPosition);
    this.setupAudio();
  }

  static async create(canvas: HTMLCanvasElement, joystick: HTMLDivElement) {
    const instance = new Interstellar(canvas, joystick);
    instance.start(instance.animate);

    loadModels().then(() => {
      instance.astronaut = new Astronaut(instance.getEffectiveKeys);
      instance.spaceship = new Spaceship();
      instance.spaceship.model.rotation.y = Math.PI;
      instance.spaceship.model.position.set(10, 5, 40);
      instance.scene.add(instance.astronaut.model, instance.spaceship.model);
    });

    return instance;
  }

  private animate = () => {
    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    this.map.update(elapsed);

    if (this.astronaut) {
      const characterPosition = this.astronaut.model.position;
      this.astronaut.update(delta, this.camera);
      this.camera.update(characterPosition, this.mouseDeltaX);
    }

    if (this.spaceship) {
      this.spaceship.update(delta);
    }

    this.renderer.render(this.scene, this.camera);
  };

  private setupAudio() {
    try {
      const backgroundMusic = getPublicUrl("music", "bg-interstellar.mp3");

      this.audioLoader.load(
        backgroundMusic,
        (buffer) => {
          this.backgroundSound.setBuffer(buffer);
          this.backgroundSound.setLoop(true);
          this.backgroundSound.setVolume(0.5);
        },
        undefined,
        (error) => {
          console.error("Error al cargar la música de fondo:", error);
        }
      );
    } catch (error) {
      console.log("Error al obtener la URL pública del audio:", error);
    }
  }
}
