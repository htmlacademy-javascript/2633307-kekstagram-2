import { openFullPicture } from './full-picture.js';

const createPictureElement = (photoData) => {
  const pictureTemplate = document.querySelector('#picture');
  if (!pictureTemplate) {
    throw new Error('Шаблон #picture не найден в документе');
  }

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
    openFullPicture(photoData); // ← функция используется здесь
  });

  return pictureElement;
};

const renderThumbnails = (photosData, containerSelector = '.pictures') => {
  const container = document.querySelector(containerSelector);
  if (!container) {
    throw new Error(`Контейнер ${containerSelector} не найден в документе`);
  }

  const existingPictures = container.querySelectorAll('.picture');
  existingPictures.forEach((picture) => picture.remove());

  const fragment = document.createDocumentFragment();
  photosData.forEach((photo) => {
    const pictureElement = createPictureElement(photo);
    fragment.appendChild(pictureElement);
  });

  container.appendChild(fragment);
};

export { renderThumbnails };
