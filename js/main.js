// Точка входа приложения: подключение модулей и запуск инициализации
import { renderThumbnails } from './thumbnails.js';
import { initImageUpload } from './form.js';
import { getData } from './api.js';
import { showDataError } from './messages.js';
import { initFilters } from './filter.js';

// Асинхронная инициализация приложения:
// загрузка данных, отрисовка миниатюр, запуск формы и фильтров
const initApp = async () => {
  try {
    const photos = await getData();
    renderThumbnails(photos);
    initImageUpload();
    initFilters(photos);
  } catch (error) {
    showDataError(error.message);
  }
};

// Запуск инициализации после полной загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);
