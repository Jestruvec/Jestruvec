import {
  handleResize,
  handleMouseMove,
  handleKeydown,
  handleKeyup,
  handleDialogContent,
  handleDialogClose,
  handleEmailSend,
  handleAudioResume,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleJoystickTouchMove,
  handleJoystickTouchEnd,
  handleLangSwitch,
  handleJoystickTouchStart,
} from "@/lib/events";
import { getDOMElements } from "@/utils";

const {
  playBtnDOM,
  aboutBtnDOM,
  projectsBtnDOM,
  contactBtnDOM,
  closeDialogBtnDOM,
  contactFormDOM,
  joystickContainerDOM,
  dialogDOM,
  langSwitcherDOM,
} = getDOMElements();

export const initEventListeners = () => {
  //redimensionar
  window.addEventListener("resize", handleResize);

  //idioma
  langSwitcherDOM.addEventListener("click", handleLangSwitch);

  //dialog
  closeDialogBtnDOM.addEventListener("click", handleDialogClose);
  contactFormDOM.addEventListener("submit", handleEmailSend);

  //navegacion
  [playBtnDOM, aboutBtnDOM, projectsBtnDOM, contactBtnDOM].forEach(
    (element) => {
      element.addEventListener("click", handleDialogContent);
    }
  );

  //reanudar audio
  window.addEventListener("click", handleAudioResume);

  //movimiento y camara en moviles
  document.addEventListener("touchstart", handleTouchStart, { passive: true });
  document.addEventListener("touchmove", handleTouchMove, { passive: true });
  document.addEventListener("touchend", handleTouchEnd);
  joystickContainerDOM.addEventListener(
    "touchstart",
    handleJoystickTouchStart,
    { passive: true }
  );
  joystickContainerDOM.addEventListener("touchmove", handleJoystickTouchMove, {
    passive: true,
  });
  joystickContainerDOM.addEventListener("touchend", handleJoystickTouchEnd);

  //movimiento y camara en escritorio
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleKeyup);
  document.addEventListener("mousemove", handleMouseMove);

  //no interactuar con el juego dentro del dialog
  dialogDOM.addEventListener(
    "touchstart",
    (e) => {
      e.stopPropagation();
    },
    { passive: false }
  );

  dialogDOM.addEventListener(
    "touchmove",
    (e) => {
      e.stopPropagation();
    },
    { passive: false }
  );

  dialogDOM.addEventListener(
    "touchend",
    (e) => {
      e.stopPropagation();
    },
    { passive: false }
  );
};
