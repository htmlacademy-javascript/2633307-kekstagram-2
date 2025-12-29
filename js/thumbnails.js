
// Функция для создания одного DOM-элемента фотографии на основе шаблона
const createPictureElement = (photoData) => {
  // Находим шаблон в документе
  const pictureTemplate = document.querySelector('#picture');
  if (!pictureTemplate) {
    throw new Error('Шаблон #picture не найден в документе');
  }

  // Клонируем содержимое шаблона
  const pictureElement = pictureTemplate.content.querySelector('.picture').cloneNode(true);

  // Находим элементы внутри шаблона
  const image = pictureElement.querySelector('.picture__img');
  const likesCount = pictureElement.querySelector('.picture__likes');
  const commentsCount = pictureElement.querySelector('.picture__comments');

  // Заполняем данными
  image.src = photoData.url;
  image.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = photoData.comments.length;

  // Добавляем data-id для возможного последующего использования
  pictureElement.dataset.id = photoData.id;

  return pictureElement;
};

// Функция для отрисовки всех миниатюр
const renderThumbnails = (photosData, containerSelector = '.pictures') => {
  // Находим контейнер для фотографий
  const container = document.querySelector(containerSelector);
  if (!container) {
    throw new Error(`Контейнер ${containerSelector} не найден в документе`);
  }

  // Удаляем существующие миниатюры (если есть)
  const existingPictures = container.querySelectorAll('.picture');
  existingPictures.forEach((picture) => picture.remove());

  // Создаем DocumentFragment для эффективной вставки
  const fragment = document.createDocumentFragment();

  // Создаем и добавляем миниатюры в fragment
  photosData.forEach((photo) => {
    const pictureElement = createPictureElement(photo);
    fragment.appendChild(pictureElement);
  });

  // Вставляем все миниатюры разом
  container.appendChild(fragment);
};

export { renderThumbnails };
