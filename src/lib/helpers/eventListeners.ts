import {
  handleResize,
  handleMouseMove,
  handleKeydown,
  handleKeyup,
  handleDialogContent,
  handleDialogClose,
  handleEmailSend,
  handleAudioResume,
} from "@/lib/helpers";
import { getDOMElements } from "@/utils";

const {
  homeBtnDOM,
  aboutBtnDOM,
  projectsBtnDOM,
  contactBtnDOM,
  closeDialogBtnDOM,
  contactFormDOM,
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
};
