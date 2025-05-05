import "@/assets/styles/index.css";
import { Interstellar } from "@/lib/games/interstellar/interstellar";
import { getDOMElements } from "@/utils";
import { initEventListeners } from "@/lib/events";

const main = async () => {
  initEventListeners();

  const { canvasDOM, joystickDOM } = getDOMElements();
  const game = await Interstellar.create(canvasDOM, joystickDOM);
  game.restart();
};

main();
