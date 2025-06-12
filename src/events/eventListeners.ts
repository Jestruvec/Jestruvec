import { getDOMElements } from "@/utils";
import {
  handleDialogContent,
  handleEmailSend,
  handleLangSwitch,
  handlePlay,
} from "@/events";

export const initEventListeners = () => {
  const {
    playBtnDOM,
    aboutBtnDOM,
    projectsBtnDOM,
    contactBtnDOM,
    contactFormDOM,
    mainDOM,
    langSwitcherDOM,
  } = getDOMElements();

  //cambiar idioma
  langSwitcherDOM.addEventListener("click", handleLangSwitch);
  //enviar email
  contactFormDOM.addEventListener("submit", handleEmailSend);
  //bloquear cursor
  playBtnDOM.addEventListener("click", handlePlay);
  //abrir dialog
  [aboutBtnDOM, projectsBtnDOM, contactBtnDOM].forEach((element) => {
    element.addEventListener("click", handleDialogContent);
  });

  //no interactuar con el juego dentro del dialog en moviles
  mainDOM.addEventListener("touchstart", (e) => {
    e.stopPropagation();
  });
  mainDOM.addEventListener("touchmove", (e) => {
    e.stopPropagation();
  });
  mainDOM.addEventListener("touchend", (e) => {
    e.stopPropagation();
  });
};
