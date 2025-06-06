import "@/assets/styles/index.css";
import "@/components/ProjectCard";
import { Interstellar } from "@/games/interstellar/interstellar";
import { getDOMElements } from "@/utils";
import { initEventListeners } from "@/events";
import { languageService } from "./services";

const main = async () => {
  await languageService.initLanguage();
  initEventListeners();

  const { canvasDOM, joystickDOM } = getDOMElements();
  Interstellar.create(canvasDOM, joystickDOM);
};

main();
