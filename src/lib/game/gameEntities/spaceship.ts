import { BaseEntity } from "@/lib/game/gameEntities/baseEntity";

export class Spaceship extends BaseEntity {
  constructor() {
    super("Spaceship", (rawName: string) =>
      rawName.replace("CharacterArmature|", "")
    );
  }

  update(delta: number): void {
    super.update(delta);
  }
}
