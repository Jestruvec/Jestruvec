import { getDOMElements } from "@/utils";
import {
  handleDialogContent,
  handleDialogClose,
  handleEmailSend,
  handleLangSwitch,
  handlePlay,
} from "@/lib/events";

export const initEventListeners = () => {
  const {
    playBtnDOM,
    aboutBtnDOM,
    projectsBtnDOM,
    contactBtnDOM,
    closeDialogBtnDOM,
    contactFormDOM,
    dialogDOM,
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
  //cerrar dialog
  closeDialogBtnDOM.addEventListener("click", handleDialogClose);

  //no interactuar con el juego dentro del dialog en moviles
  dialogDOM.addEventListener("touchstart", (e) => {
    e.stopPropagation();
  });
  dialogDOM.addEventListener("touchmove", (e) => {
    e.stopPropagation();
  });
  dialogDOM.addEventListener("touchend", (e) => {
    e.stopPropagation();
  });
};
