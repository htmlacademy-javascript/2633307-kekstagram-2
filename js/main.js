import {createPhotosArray} from './data.js';
import { renderThumbnails } from './thumbnails.js';
import { openFullPicture } from './full-picture.js';
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
// const pictures = []; // Здесь должен быть массив с данными фотографий

// // Функция для инициализации галереи
// const initGallery = () => {
//   // Рендерим миниатюры
//   renderThumbnails(pictures);

//   // Находим все миниатюры после их отрисовки
//   const thumbnails = document.querySelectorAll('.picture');

//   // Добавляем обработчики кликов на миниатюры
//   thumbnails.forEach((thumbnail, index) => {
//     thumbnail.addEventListener('click', (evt) => {
//       evt.preventDefault();
//       openFullPicture(pictures[index]);
//     });
//   });
// };

// // Запускаем инициализацию после загрузки данных
// initGallery();
