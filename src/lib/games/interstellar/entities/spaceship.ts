import { BaseEntity } from "@/lib/games/baseEntity";

export class Spaceship extends BaseEntity {
  constructor() {
    super("Spaceship", (rawName: string) =>
      rawName.replace("CharacterArmature|", "")
    );
  }

  update(delta: number): void {
    this.mixer.update(delta);
  }
}
