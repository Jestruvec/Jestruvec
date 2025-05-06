import { BaseEntity } from "@/lib/games/baseEntity";

export class Spaceship extends BaseEntity {
  constructor() {
    const cleanAnimationName = (rawName: string) =>
      rawName.replace("CharacterArmature|", "");

    super("Spaceship", cleanAnimationName);
  }

  update(delta: number): void {
    this.mixer.update(delta);
  }
}
