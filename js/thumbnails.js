import { onBigPictureOpen } from './big-picture-handler.js';

const createPictureElement = (photoData) => {
  const pictureTemplate = document.querySelector('#picture');
  if (!pictureTemplate) {
    throw new Error('Шаблон #picture не найден в документе');
  }
  // Клонируем шаблон
  const pictureElement = pictureTemplate.content.querySelector('.picture').cloneNode(true);
  const image = pictureElement.querySelector('.picture__img');
  const likesCount = pictureElement.querySelector('.picture__likes');
  const commentsCount = pictureElement.querySelector('.picture__comments');

  image.src = photoData.url;
  image.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = photoData.comments.length;
  pictureElement.dataset.id = photoData.id;

  // Явное использование импортированной функции
  pictureElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    onBigPictureOpen(photoData); // ← функция используется здесь
  });

  return pictureElement;
};
// Функция для очистки миниатюр
// export const clearThumbnails = () => {
//   const container = document.querySelector('.pictures');
//   if (!container) {
//     // eslint-disable-next-line no-console
//     console.error('Контейнер .pictures не найден');
//     return;
//   }

//   // Находим все элементы с классом .picture
//   const thumbnails = container.querySelectorAll('.picture');
//   // eslint-disable-next-line no-console
//   console.log(`Очищаем ${thumbnails.length} миниатюр`);

//   // Удаляем все миниатюры
//   thumbnails.forEach((thumbnail) => {
//     thumbnail.remove();
//   });


// };


// Функция отрисовки миниатюр
const renderThumbnails = (photosData, containerSelector = '.pictures') => {
  const container = document.querySelector(containerSelector);
  if (!container) {
    throw new Error(`Контейнер ${containerSelector} не найден в документе`);
  }
  // Очищаем контейнер перед отрисовкой новых миниатюр
  const existingPictures = container.querySelectorAll('.picture');
  existingPictures.forEach((picture) => picture.remove());
  // Создаем фрагмент для оптимальной отрисовки
  const fragment = document.createDocumentFragment();
  photosData.forEach((photo) => {
    const pictureElement = createPictureElement(photo);
    fragment.appendChild(pictureElement);
  });

  container.appendChild(fragment);
};

export { renderThumbnails };
