import { sceneSetup } from "@/lib/scene/sceneSetup";
import { getDOMElements } from "@/utils";
import { validateContactForm } from "@/lib/helpers/formHelper";
import { sendEmail } from "@/lib/services/emailService";

const {
  homeBtnDOM,
  aboutBtnDOM,
  projectsBtnDOM,
  contactBtnDOM,
  dialogDOM,
  canvasDOM,
  aboutSectionDOM,
  projectsSectionDOM,
  contactSectionDOM,
  submitBtnDOM,
  formError,
  successMessage,
} = getDOMElements();
const { camera, renderer } = sceneSetup();
export const keysPressed = new Set<string>();
export let mouseDeltaX = 0;
export let mouseDeltaY = 0;
let mouseMoveTimeout: ReturnType<typeof setTimeout> | null = null;

export const handleResize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
};

export const handleMouseMove = (e: MouseEvent) => {
  if (document.pointerLockElement === renderer.domElement) {
    mouseDeltaX = e.movementX;
    mouseDeltaY = e.movementY;

    if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
    mouseMoveTimeout = setTimeout(() => {
      mouseDeltaX = 0;
      mouseDeltaY = 0;
    }, 50);
  }
};

export const handleKeydown = (e: KeyboardEvent) => {
  keysPressed.add(e.key.toLowerCase());
};

export const handleKeyup = (e: KeyboardEvent) => {
  keysPressed.delete(e.key.toLowerCase());
};

export const handleDialogContent = (event: MouseEvent) => {
  const clickedButton = event.target as HTMLElement;

  const hideAllSections = () => {
    const sections = [aboutSectionDOM, projectsSectionDOM, contactSectionDOM];
    sections.forEach((section) => {
      section.classList.remove("flex");
      section.classList.add("hidden");
    });
  };

  const showSection = (sectionDOM: HTMLElement) => {
    sectionDOM.classList.remove("hidden");
    sectionDOM.classList.add("flex");
  };

  hideAllSections();

  if (clickedButton === homeBtnDOM) {
    canvasDOM.requestPointerLock();
    dialogDOM.classList.remove("show");
    return;
  }

  if (clickedButton === aboutBtnDOM) {
    showSection(aboutSectionDOM);
  } else if (clickedButton === projectsBtnDOM) {
    showSection(projectsSectionDOM);
  } else if (clickedButton === contactBtnDOM) {
    showSection(contactSectionDOM);
  }

  dialogDOM.classList.add("show");
};

export const handleDialogClose = () => {
  dialogDOM.classList.remove("show");
};

export const handleEmailSend = async (e: SubmitEvent) => {
  e.preventDefault();
  submitBtnDOM.disabled = true;
  const form = e.target as HTMLFormElement;

  if (!validateContactForm(form)) {
    submitBtnDOM.disabled = false;
    return;
  }

  try {
    await sendEmail(form);

    successMessage.classList.remove("hidden");
    setTimeout(() => {
      successMessage.classList.add("show");
    }, 15);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    successMessage.classList.remove("show");

    setTimeout(() => {
      successMessage.classList.add("hidden");
    }, 300);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      formError.innerText = error.message;
    }

    formError.classList.remove("hidden");
  } finally {
    submitBtnDOM.disabled = false;
  }

  form.reset();
};
