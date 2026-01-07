import { createPhotosArray } from './data.js';
import { renderThumbnails } from './thumbnails.js';
import { initImageUpload } from './form.js';

// Создаем временные данные для разработки
const photos = createPhotosArray();

// Отрисовываем миниатюры
renderThumbnails(photos);

// Инициализируем форму загрузки изображений
initImageUpload();
