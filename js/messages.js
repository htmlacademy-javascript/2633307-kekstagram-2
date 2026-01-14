// Модуль показа системных сообщений (успех, ошибка, ошибка загрузки данных)
const REMOVE_MESSAGE_TIMEOUT = 5000;

// Показ сообщения об ошибке загрузки данных с сервера
const showDataError = (message) => {
  const template = document.querySelector('#data-error');
  if (!template) {
    return;
  }

  const element = template.content.querySelector('.data-error').cloneNode(true);
  if (message) {
    element.querySelector('.data-error__title').textContent = message;
  }

  document.body.append(element);

  setTimeout(() => {
    element.remove();
  }, REMOVE_MESSAGE_TIMEOUT);
};

// Закрытие текущего сообщения (успех или ошибка) и снятие обработчиков
const hideMessage = () => {
  const existsElement = document.querySelector('.success') || document.querySelector('.error');
  if (existsElement) {
    existsElement.remove();
  }
  document.removeEventListener('keydown', onDocumentKeydown);
  document.body.removeEventListener('click', onBodyClick);
};

// Обработчик клика по кнопке закрытия сообщения
const onCloseButtonClick = () => {
  hideMessage();
};

// Обработчик нажатия Esc для закрытия сообщения
function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    hideMessage();
  }
}

// Обработчик клика по фону для закрытия сообщения
function onBodyClick(evt) {
  if (evt.target.closest('.success__inner') || evt.target.closest('.error__inner')) {
    return;
  }
  hideMessage();
}

// Универсальная функция показа сообщения по шаблону (успех/ошибка)
const showMessage = (templateId, message) => {
  const template = document.querySelector(`#${templateId}`);
  if (!template) {
    return;
  }

  const element = template.content.querySelector(`.${templateId}`).cloneNode(true);
  if (message) {
    element.querySelector(`.${templateId}__message`).textContent = message;
  }

  element.querySelector(`.${templateId}__button`).addEventListener('click', onCloseButtonClick);
  document.body.append(element);
  document.body.addEventListener('click', onBodyClick);
  document.addEventListener('keydown', onDocumentKeydown);
};

// Публичные функции для показа сообщений об успехе и ошибке
const showSuccessMessage = (message) => showMessage('success', message);
const showErrorMessage = (message) => showMessage('error', message);

export { showDataError, showSuccessMessage, showErrorMessage };
