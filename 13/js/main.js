import { renderThumbnails } from './thumbnails.js';
import { initImageUpload } from './form.js';
import { getData } from './api.js';
import { showDataError } from './messages.js';
import { initFilters, } from './filter.js';

// Функция инициализации приложения
const initApp = async () => {
  try {
    // Загружаем данные с сервера
    const photos = await getData();

    // Отрисовываем миниатюры
    renderThumbnails(photos);

    // Инициализируем форму загрузки изображений
    initImageUpload();

    // Инициализируем фильтры
    initFilters(photos);

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка загрузки данных:', error);

    // Показываем сообщение об ошибке
    showDataError(error.message);

    // Добавляем кнопку для повторной попытки
    const existingError = document.querySelector('.data-error');
    if (existingError) {
      const retryButton = document.createElement('button');
      retryButton.type = 'button';
      retryButton.className = 'data-error__button';
      retryButton.textContent = 'Попробовать снова';
      retryButton.addEventListener('click', () => {
        location.reload();
      });

      const inner = existingError.querySelector('.data-error__inner');
      if (inner) {
        inner.appendChild(retryButton);
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', initApp);
