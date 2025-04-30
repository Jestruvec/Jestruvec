import { sceneSetup, setupAudio } from "@/lib/scene";
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
  formErrorDOM,
  successMessageDOM,
  joystickDOM,
  joystickContainerDOM,
} = getDOMElements();

const { camera, renderer } = sceneSetup();
const { backgroundSound } = setupAudio();

//Variables de movimiento y camara
const keysPressed = new Set<string>();

//Escritorio
export let mouseDeltaX = 0;
export let mouseDeltaY = 0;
let mouseMoveTimeout: ReturnType<typeof setTimeout> | null = null;

//Moviles
// let cameraTouchId: number | null = null;
let isTouching = false;
let lastTouchX = 0;
let lastTouchY = 0;

// let joystickTouchId: number | null = null;
let joystickTouchStartX = 0;
let joystickTouchStartY = 0;
const keysToSimulate = new Set<string>();

export const handleResize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
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
    homeBtnDOM.blur();
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

    successMessageDOM.classList.remove("hidden");
    setTimeout(() => {
      successMessageDOM.classList.add("show");
    }, 15);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    successMessageDOM.classList.remove("show");

    setTimeout(() => {
      successMessageDOM.classList.add("hidden");
    }, 300);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      formErrorDOM.innerText = error.message;
    }

    formErrorDOM.classList.remove("hidden");
  } finally {
    submitBtnDOM.disabled = false;
  }

  form.reset();
};

export const handleAudioResume = () => {
  if (!backgroundSound.isPlaying) {
    backgroundSound.play();
  }
};

//Movimiento y camara

export const getEffectiveKeys = () => {
  return new Set([...keysPressed, ...keysToSimulate]);
};

//Escritorio

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

//Moviles

export const handleTouchStart = (e: TouchEvent) => {
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];
    const touchTarget = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    ) as HTMLElement;

    if (touchTarget && joystickContainerDOM.contains(touchTarget)) {
      // joystickTouchId = touch.identifier;
      joystickTouchStartX = touch.clientX;
      joystickTouchStartY = touch.clientY;
    } else {
      // cameraTouchId = touch.identifier;
      isTouching = true;
      lastTouchX = touch.clientX;
      lastTouchY = touch.clientY;
    }
  }
};

export const handleTouchMove = (e: TouchEvent) => {
  if (isTouching && e.touches.length === 1) {
    const touch = e.touches[0];

    mouseDeltaX = touch.clientX - lastTouchX;
    mouseDeltaY = touch.clientY - lastTouchY;

    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;

    if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
    mouseMoveTimeout = setTimeout(() => {
      mouseDeltaX = 0;
      mouseDeltaY = 0;
    }, 50);
  }
};

export const handleTouchEnd = () => {
  isTouching = false;
};

export const handleJoystickTouchMove = (e: TouchEvent) => {
  const touch = e.touches[0];
  const dx = touch.clientX - joystickTouchStartX;
  const dy = touch.clientY - joystickTouchStartY;
  updateJoystick(dx, dy);
};

export const handleJoystickTouchEnd = () => {
  resetJoystick();
};

const getDirectionFromAngle = (angle: number) => {
  const direction = new Set<string>();

  if (angle >= 45 && angle < 135) direction.add("s"); // down
  else if (angle >= 135 && angle < 225) direction.add("a"); // left
  else if (angle >= 225 && angle < 315) direction.add("w"); // up
  else direction.add("d"); // right

  return direction;
};

const updateJoystick = (dx: number, dy: number) => {
  // const distance = Math.sqrt(dx * dx + dy * dy);
  const maxDistance = 40;

  const angle = (Math.atan2(-dy, -dx) * 180) / Math.PI + 180;

  const clampedDx = Math.min(maxDistance, Math.max(-maxDistance, dx));
  const clampedDy = Math.min(maxDistance, Math.max(-maxDistance, dy));

  joystickDOM.style.left = `${40 + clampedDx}px`;
  joystickDOM.style.top = `${40 + clampedDy}px`;

  keysToSimulate.clear();
  for (const dir of getDirectionFromAngle(angle)) {
    keysToSimulate.add(dir);
  }
};

const resetJoystick = () => {
  joystickDOM.style.left = `40px`;
  joystickDOM.style.top = `40px`;
  keysToSimulate.clear();
};
