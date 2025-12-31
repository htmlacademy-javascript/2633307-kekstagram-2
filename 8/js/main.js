import {createPhotosArray} from './data.js';
import { renderThumbnails } from './thumbnails.js';
// Создаем временные данные для разработки
const photos = createPhotosArray();
// Отрисовываем миниатюры
renderThumbnails(photos);
// Для тестирования - выводим информацию в консоль

// eslint-disable-next-line no-console
console.log(`Отображено ${photos.length} фотографий`);
// eslint-disable-next-line no-console
console.log(
  createPhotosArray()
);
