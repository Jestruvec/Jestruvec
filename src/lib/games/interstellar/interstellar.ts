import { Game } from "@/lib/games/game";
import { Astronaut } from "./entities/astronaut";
import { Spaceship } from "./entities/spaceship";
import { createMap } from "./map/map";
import { getPublicUrl } from "@/lib/services";
import { loadModels } from "@/lib/helpers";

export class Interstellar extends Game {
  astronaut = new Astronaut(this.getEffectiveKeys);
  spaceship = new Spaceship();
  map = createMap(this.scene);

  private constructor(canvas: HTMLCanvasElement, joystick: HTMLDivElement) {
    super(canvas, joystick);

    this.setupAudio();
    this.spaceship.model.rotation.y = Math.PI;
    this.spaceship.model.position.set(10, 5, 40);
    this.scene.add(this.astronaut.model, this.spaceship.model);
  }

  static async create(canvas: HTMLCanvasElement, joystick: HTMLDivElement) {
    await loadModels();
    return new Interstellar(canvas, joystick);
  }

  private animate = () => {
    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();
    const characterPosition = this.astronaut.model.position;

    this.map.update(elapsed);
    this.astronaut.update(delta, this.camera);
    this.spaceship.update(delta);
    this.camera.update(characterPosition, this.mouseDeltaX);

    this.renderer.render(this.scene, this.camera);
  };

  private setupAudio() {
    try {
      const backgroundMusic = getPublicUrl("music", "Background.mp3");

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

  restart() {
    this.start(this.animate);
  }
}
