import { getDOMElements } from "@/utils";

const { nameError, emailError, messageError, formError, successMessage } =
  getDOMElements();

export const validateContactForm = (form: HTMLFormElement): boolean => {
  let isValid = true;
  const name = form.user_name.value.trim();
  const email = form.user_email.value.trim();
  const message = form.message.value.trim();
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  successMessage.classList.add("hidden");
  hideErrors();

  if (!name) {
    showError(nameError);
    isValid = false;
  }

  if (!email || !emailRegex.test(email)) {
    showError(emailError);
    isValid = false;
  }

  if (!message) {
    showError(messageError);
    isValid = false;
  }

  return isValid;
};

const hideErrors = () => {
  [nameError, emailError, messageError, formError].forEach((element) => {
    element.classList.add("hidden");

    if (element === formError) {
      formError.innerText = "Something went wrong, please try again later.";
    }
  });
};

const showError = (element: HTMLElement) => {
  element.classList.remove("hidden");
};
