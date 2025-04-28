export const getDOMElements = () => ({
  canvasDOM: document.querySelector("canvas") as HTMLCanvasElement,
  homeBtnDOM: document.getElementById("home-button") as HTMLButtonElement,
  aboutBtnDOM: document.getElementById("about-button") as HTMLButtonElement,
  projectsBtnDOM: document.getElementById(
    "projects-button"
  ) as HTMLButtonElement,
  contactBtnDOM: document.getElementById("contact-button") as HTMLButtonElement,
  dialogDOM: document.getElementById("dialog") as HTMLDivElement,
  aboutSectionDOM: document.getElementById("about-section") as HTMLElement,
  projectsSectionDOM: document.getElementById(
    "projects-section"
  ) as HTMLElement,
  contactSectionDOM: document.getElementById("contact-section") as HTMLElement,
  closeDialogBtnDOM: document.getElementById(
    "close-dialog-button"
  ) as HTMLButtonElement,
  contactFormDOM: document.getElementById("contact-form") as HTMLFormElement,
  submitBtnDOM: document.getElementById(
    "form-contact-submit-btn"
  ) as HTMLButtonElement,
  nameError: document.getElementById(
    "form-contact-name-error"
  ) as HTMLSpanElement,
  emailError: document.getElementById(
    "form-contact-email-error"
  ) as HTMLSpanElement,
  messageError: document.getElementById(
    "form-contact-message-error"
  ) as HTMLSpanElement,
  formError: document.getElementById("form-contact-error") as HTMLSpanElement,
  successMessage: document.getElementById(
    "form-contact-success-message"
  ) as HTMLSpanElement,
});
