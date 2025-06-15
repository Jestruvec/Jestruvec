import { getDOMElements } from "@/utils";
import { validateContactForm } from "@/helpers/formHelper";
import { sendEmail } from "@/services/email";
import { languageService } from "@/services";

const {
  playBtnDOM,
  aboutBtnDOM,
  projectsBtnDOM,
  contactBtnDOM,
  canvasDOM,
  aboutSectionDOM,
  projectsSectionDOM,
  contactSectionDOM,
  submitBtnDOM,
  formErrorDOM,
  nameErrorDOM,
  emailErrorDOM,
  messageErrorDOM,
  successMessageDOM,
  joystickContainerDOM,
  mainDOM,
  footerDOM,
} = getDOMElements();

const sections = [aboutSectionDOM, projectsSectionDOM, contactSectionDOM];

const hideAllSections = () => {
  sections.forEach((section) => {
    section.classList.remove("flex");
    section.classList.add("hidden");
  });
};

const showSection = (section: HTMLElement) => {
  section.classList.remove("hidden");
  section.classList.add("flex");
};

export const handleLangSwitch = () => {
  const { getCurrentLang, loadLanguage } = languageService;
  const newLang = getCurrentLang() === "en" ? "es" : "en";
  loadLanguage(newLang);
};

export const handleDialogContent = (event: MouseEvent) => {
  const clickedButton = event.target as HTMLElement;

  hideAllSections();

  //show clicked section btn
  let section: HTMLElement;

  switch (clickedButton) {
    case aboutBtnDOM:
      section = aboutSectionDOM;
      aboutBtnDOM.blur();
      break;
    case projectsBtnDOM:
      section = projectsSectionDOM;
      projectsBtnDOM.blur();
      break;
    case contactBtnDOM:
      section = contactSectionDOM;
      contactBtnDOM.blur();
      break;
    default:
      return;
  }

  showSection(section);

  //hide joystick
  joystickContainerDOM.classList.remove("show");
  //show footer and main content
  mainDOM.classList.add("show");
  footerDOM.classList.add("show");
};

export const handleSendEmail = async (e: SubmitEvent) => {
  e.preventDefault();

  //hide success message
  successMessageDOM.classList.remove("show");
  successMessageDOM.classList.add("hidden");

  //hide error messages
  [formErrorDOM, nameErrorDOM, emailErrorDOM, messageErrorDOM].forEach((elem) =>
    elem.classList.add("hidden")
  );

  //inhabilitar el btn de submit
  submitBtnDOM.disabled = true;

  //validar el formulario
  const form = e.target as HTMLFormElement;
  if (!validateContactForm(form)) {
    submitBtnDOM.disabled = false;
    return;
  }

  try {
    await sendEmail(form);

    //mostrar el msg de exito
    successMessageDOM.classList.remove("hidden");
    successMessageDOM.classList.add("show");

    //resetear el form
    form.reset();
  } catch (error) {
    if (error instanceof Error) {
      formErrorDOM.innerText = error.message;
    } else {
      formErrorDOM.innerText = "Unknown error";
    }

    formErrorDOM.classList.remove("hidden");
  } finally {
    submitBtnDOM.disabled = false;
  }
};

export const handlePlay = () => {
  mainDOM.classList.toggle("show");
  footerDOM.classList.toggle("show");
  joystickContainerDOM.classList.toggle("show");

  if (!mainDOM.classList.contains("show")) {
    canvasDOM.requestPointerLock();
  }

  playBtnDOM.blur();
};

export const handleNextSection = () => {
  const currentSection = sections.find((section) =>
    section.classList.contains("flex")
  );

  hideAllSections();

  switch (currentSection) {
    case aboutSectionDOM:
      showSection(projectsSectionDOM);
      break;
    case projectsSectionDOM:
      showSection(contactSectionDOM);
      break;
    case contactSectionDOM:
      showSection(aboutSectionDOM);
      break;
    default:
      break;
  }
};
