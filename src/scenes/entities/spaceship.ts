import { BaseEntity } from "@/scenes/baseEntity";

export class Spaceship extends BaseEntity {
  constructor() {
    const cleanAnimationName = (rawName: string) =>
      rawName.replace("CharacterArmature|", "");

    super("Spaceship", cleanAnimationName);
  }
}
