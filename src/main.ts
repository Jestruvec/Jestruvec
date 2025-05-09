import "@/assets/styles/index.css";
import { Interstellar } from "@/lib/games/interstellar/interstellar";
import { getDOMElements } from "@/utils";
import { initEventListeners } from "@/lib/events";

const main = async () => {
  initEventListeners();

  const { canvasDOM, joystickDOM } = getDOMElements();
  Interstellar.create(canvasDOM, joystickDOM);
};

main();
