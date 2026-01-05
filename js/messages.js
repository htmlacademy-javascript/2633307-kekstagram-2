// Показ сообщения об успехе
const successTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');
const errorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');

function showSuccessMessage(message = 'Форма успешно отправлена!') {
  const successElement = successTemplate.cloneNode(true);
  const successMessage = successElement.querySelector('.success__message');

  if (successMessage) {
    successMessage.textContent = message;
  }

  document.body.appendChild(successElement);

  successElement.addEventListener('click', (evt) => {
    if (evt.target === successElement || evt.target.classList.contains('success__button')) {
      successElement.remove();
    }
  });

  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      successElement.remove();
    }
  });
}

function showErrorMessage(message = 'Что-то пошло не так. Попробуйте еще раз.') {
  const errorElement = errorTemplate.cloneNode(true);
  const errorMessage = errorElement.querySelector('.error__message');

  if (errorMessage) {
    errorMessage.textContent = message;
  }

  document.body.appendChild(errorElement);

  errorElement.addEventListener('click', (evt) => {
    if (evt.target === errorElement || evt.target.classList.contains('error__button')) {
      errorElement.remove();
    }
  });

  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      errorElement.remove();
    }
  });

  return errorElement;
}

export { showSuccessMessage, showErrorMessage };
