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
  handleJoystickTouchStar,
  handleJoystickTouchMove,
  handleJoystickTouchEnd,
} from "@/lib/helpers";
import { getDOMElements } from "@/utils";

const {
  homeBtnDOM,
  aboutBtnDOM,
  projectsBtnDOM,
  contactBtnDOM,
  closeDialogBtnDOM,
  contactFormDOM,
  joystickContainerDOM,
  dialogDOM,
} = getDOMElements();

export const initEventListeners = () => {
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleKeyup);
  document.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("resize", handleResize);
  closeDialogBtnDOM.addEventListener("click", handleDialogClose);
  contactFormDOM.addEventListener("submit", handleEmailSend);

  [homeBtnDOM, aboutBtnDOM, projectsBtnDOM, contactBtnDOM].forEach(
    (element) => {
      element.addEventListener("click", handleDialogContent);
    }
  );

  window.addEventListener("click", handleAudioResume);

  document.addEventListener("touchstart", handleTouchStart, { passive: true });
  document.addEventListener("touchmove", handleTouchMove, { passive: true });
  document.addEventListener("touchend", handleTouchEnd);
  joystickContainerDOM.addEventListener("touchstart", handleJoystickTouchStar);
  joystickContainerDOM.addEventListener("touchmove", handleJoystickTouchMove);
  joystickContainerDOM.addEventListener("touchend", handleJoystickTouchEnd);

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
