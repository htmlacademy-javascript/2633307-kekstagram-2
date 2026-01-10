// Функция для показа сообщения об успехе
export const showSuccessMessage = (message = 'Изображение успешно загружено!') => {
  const template = document.querySelector('#success');
  if (!template) {
    // eslint-disable-next-line no-console
    console.warn('Шаблон #success не найден');
    return null;
  }

  // Клонируем элемент из шаблона
  const successElement = template.content.querySelector('.success').cloneNode(true);
  const messageElement = successElement.querySelector('.success__message');

  // Устанавливаем текст сообщения
  if (messageElement && message) {
    messageElement.textContent = message;
  }

  // Размещаем перед закрывающим тегом </body>
  document.body.appendChild(successElement);

  // Функция для удаления сообщения
  const closeMessage = () => {
    if (successElement.parentNode) {
      successElement.remove();
      // eslint-disable-next-line no-use-before-define
      document.removeEventListener('keydown', onEscKeyDown);
      // eslint-disable-next-line no-use-before-define
      successElement.removeEventListener('click', onOutsideClick);
    }
  };

  // Обработчик клавиши Escape
  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      closeMessage();
    }
  };

  // Обработчик клика по области вне сообщения
  const onOutsideClick = (evt) => {
    if (evt.target === successElement) {
      closeMessage();
    }
  };

  // 1. Обработчик кнопки .success__button
  const closeButton = successElement.querySelector('.success__button');
  if (closeButton) {
    closeButton.addEventListener('click', closeMessage);
  }

  // 2. Обработчик клика по области вне сообщения
  successElement.addEventListener('click', onOutsideClick);

  // 3. Обработчик клавиши Esc
  document.addEventListener('keydown', onEscKeyDown);

  // Возвращаем элемент для возможности управления им извне
  return successElement;
};

/**
 * Показывает сообщение об ошибке операции
 * @param {string} message - Текст сообщения
 * @returns {HTMLElement|null} Элемент сообщения
 */
export const showErrorMessage = (message = 'Что-то пошло не так. Попробуйте еще раз.') => {
  const template = document.querySelector('#error');
  if (!template) {
    // eslint-disable-next-line no-console
    console.warn('Шаблон #error не найден');
    return null;
  }

  const errorElement = template.content.querySelector('.error').cloneNode(true);
  const messageElement = errorElement.querySelector('.error__message');

  if (messageElement && message) {
    messageElement.textContent = message;
  }

  // Размещаем перед закрывающим тегом </body>
  document.body.appendChild(errorElement);

  // Функция для удаления сообщения
  const closeMessage = () => {
    if (errorElement.parentNode) {
      errorElement.remove();
      // eslint-disable-next-line no-use-before-define
      document.removeEventListener('keydown', onEscKeyDown);
      // eslint-disable-next-line no-use-before-define
      errorElement.removeEventListener('click', onOutsideClick);
    }
  };

  // Обработчик клавиши Escape
  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      closeMessage();
    }
  };

  // Обработчик клика по области вне сообщения
  const onOutsideClick = (evt) => {
    if (evt.target === errorElement) {
      closeMessage();
    }
  };

  // 1. Обработчик кнопки .error__button
  const closeButton = errorElement.querySelector('.error__button');
  if (closeButton) {
    closeButton.addEventListener('click', closeMessage);
  }

  // 2. Обработчик клика по области вне сообщения
  errorElement.addEventListener('click', onOutsideClick);

  // 3. Обработчик клавиши Esc
  document.addEventListener('keydown', onEscKeyDown);

  return errorElement;
};

/**
 * Показывает сообщение об ошибке загрузки данных
 * @param {string} message - Текст сообщения
 */
export const showDataError = (message = 'Не удалось загрузить фотографии с сервера') => {
  const template = document.querySelector('#data-error');
  if (!template) {
    // eslint-disable-next-line no-console
    console.warn('Шаблон #data-error не найден');
    return;
  }

  const element = template.content.querySelector('.data-error').cloneNode(true);
  const title = element.querySelector('.data-error__title');

  if (title) {
    title.textContent = message;
  }

  // Размещаем перед закрывающим тегом </body>
  document.body.appendChild(element);

  // Автоматическое удаление через 5 секунд
  setTimeout(() => {
    if (element.parentNode) {
      element.remove();
    }
  }, 5000);
};
