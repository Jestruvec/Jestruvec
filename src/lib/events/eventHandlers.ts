import { getDOMElements } from "@/utils";
import { validateContactForm } from "@/lib/helpers/formHelper";
import { sendEmail } from "@/lib/services/email";
import { loadLanguage, getCurrentLang } from "@/lib/services";

const {
  playBtnDOM,
  aboutBtnDOM,
  projectsBtnDOM,
  contactBtnDOM,
  dialogDOM,
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
} = getDOMElements();

export const handleLangSwitch = () => {
  const newLang = getCurrentLang() === "en" ? "es" : "en";
  loadLanguage(newLang);
};
export const handleDialogContent = (event: MouseEvent) => {
  const clickedButton = event.target as HTMLElement;

  //quitar el focus a todos los btns
  [aboutBtnDOM, projectsBtnDOM, contactBtnDOM].forEach((button) => {
    button.classList.remove("font-bold");
  });

  //enfocar el btn clickeado
  clickedButton.classList.add("font-bold");

  //ocultar todas la secciones
  [aboutSectionDOM, projectsSectionDOM, contactSectionDOM].forEach(
    (section) => {
      section.classList.remove("flex");
      section.classList.add("hidden");
    }
  );

  //mostrar la seccion correspondiente al btn clickeado
  let section: HTMLElement;

  switch (clickedButton) {
    case aboutBtnDOM:
      section = aboutSectionDOM;
      break;
    case projectsBtnDOM:
      section = projectsSectionDOM;
      break;
    case contactBtnDOM:
      section = contactSectionDOM;
      break;
    default:
      console.log("No se encontro el btn clickeado");
      return;
  }

  section.classList.remove("hidden");
  section.classList.add("flex");

  //ocultar el joystick
  joystickContainerDOM.classList.remove("show");
  //mostrar el dialog
  dialogDOM.classList.add("show");
};
export const handleDialogClose = () => {
  //quitar focus a btns
  [aboutBtnDOM, projectsBtnDOM, contactBtnDOM].forEach((button) => {
    button.classList.remove("font-bold");
  });

  //ocultar msg de exito
  successMessageDOM.classList.remove("show");
  successMessageDOM.classList.add("hidden");

  //ocultar msg de error
  [formErrorDOM, nameErrorDOM, emailErrorDOM, messageErrorDOM].forEach((elem) =>
    elem.classList.add("hidden")
  );

  //ocultar dialog
  dialogDOM.classList.remove("show");

  //mostrar joystick
  joystickContainerDOM.classList.add("show");
};
export const handleEmailSend = async (e: SubmitEvent) => {
  //prevenir la recarga de la pagina
  e.preventDefault();

  //ocultar msg de exito
  successMessageDOM.classList.remove("show");
  successMessageDOM.classList.add("hidden");

  //inhabilitar el btn de submit
  submitBtnDOM.disabled = true;

  //validar el formulario
  const form = e.target as HTMLFormElement;
  if (!validateContactForm(form)) {
    submitBtnDOM.disabled = false;
    return;
  }

  try {
    //enviar el form al service
    await sendEmail(form);

    //mostrar el msg de exito
    successMessageDOM.classList.remove("hidden");
    successMessageDOM.classList.add("show");

    //resetear el form
    form.reset();
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      formErrorDOM.innerText = error.message;
    }

    formErrorDOM.classList.remove("hidden");
  } finally {
    submitBtnDOM.disabled = false;
  }
};
export const handlePlay = () => {
  //blockear el cursor
  canvasDOM.requestPointerLock();
  //quitar el focus al btn play
  playBtnDOM.blur();
  //cerrar el dialog
  handleDialogClose();
};
