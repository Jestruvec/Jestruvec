import { getDOMElements } from "@/utils";

const {
  nameErrorDOM,
  emailErrorDOM,
  messageErrorDOM,
  formErrorDOM,
  successMessageDOM,
} = getDOMElements();

export const validateContactForm = (form: HTMLFormElement): boolean => {
  let isValid = true;
  const name = form.user_name.value.trim();
  const email = form.user_email.value.trim();
  const message = form.message.value.trim();
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  successMessageDOM.classList.add("hidden");
  hideErrors();

  if (!name) {
    showError(nameErrorDOM);
    isValid = false;
  }

  if (!email || !emailRegex.test(email)) {
    showError(emailErrorDOM);
    isValid = false;
  }

  if (!message) {
    showError(messageErrorDOM);
    isValid = false;
  }

  return isValid;
};

const hideErrors = () => {
  [nameErrorDOM, emailErrorDOM, messageErrorDOM, formErrorDOM].forEach(
    (element) => {
      element.classList.add("hidden");

      if (element === formErrorDOM) {
        formErrorDOM.innerText =
          "Something went wrong, please try again later.";
      }
    }
  );
};

const showError = (element: HTMLElement) => {
  element.classList.remove("hidden");
};
