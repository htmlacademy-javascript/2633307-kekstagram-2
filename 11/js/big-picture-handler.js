
const bigPictureModal = document.querySelector('.big-picture');
const closeButton = bigPictureModal.querySelector('.big-picture__cancel');
const socialComments = bigPictureModal.querySelector('.social__comments');
const socialCommentCount = bigPictureModal.querySelector('.social__comment-count');
const commentsLoader = bigPictureModal.querySelector('.comments-loader');
const likesCountElement = bigPictureModal.querySelector('.likes-count');
const socialCommentShownCount = bigPictureModal.querySelector('.social__comment-shown-count'); // Используется
const socialCommentTotalCount = bigPictureModal.querySelector('.social__comment-total-count'); // Используется
const socialCaption = bigPictureModal.querySelector('.social__caption');
const bigPictureImage = bigPictureModal.querySelector('.big-picture__img img');

// Переменные для управления комментариями
let currentComments = [];
let commentsShown = 0;
const COMMENTS_PER_LOAD = 5;

// Функция для создания элемента комментария
function createCommentElement(comment) {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');
  commentElement.innerHTML = `
    <img class="social__picture" src="${comment.avatar}" alt="${comment.name}" width="35" height="35">
    <p class="social__text">${comment.message}</p>
  `;
  return commentElement;
}

// Функция для обновления счетчика комментариев
function updateCommentCounter() {
  // Обновляем оба span-элемента
  socialCommentShownCount.textContent = commentsShown;
  socialCommentTotalCount.textContent = currentComments.length;
}

// Функция для отрисовки комментариев (по 5 штук)
function renderComments() {
  const commentsToShow = currentComments.slice(commentsShown, commentsShown + COMMENTS_PER_LOAD);
  const fragment = document.createDocumentFragment();

  commentsToShow.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    fragment.appendChild(commentElement);
  });

  socialComments.appendChild(fragment);
  commentsShown += commentsToShow.length;

  // Обновляем счетчик показанных комментариев
  updateCommentCounter();

  // Показываем или скрываем кнопку "Загрузить еще"
  if (commentsShown >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
}

// Обработчик нажатия на кнопку "Загрузить еще комментарии"
function onCommentsLoaderClick() {
  renderComments();
}

// Обработчик нажатия клавиши Esc
function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    onBigPictureClose();
  }
}

// Обработчик закрытия модального окна
function onBigPictureClose() {
  bigPictureModal.classList.add('hidden');
  document.body.classList.remove('modal-open');

  // Сбрасываем состояние комментариев
  commentsShown = 0;
  currentComments = [];
  socialComments.innerHTML = '';

  // Удаляем обработчики событий
  document.removeEventListener('keydown', onDocumentKeydown);
  closeButton.removeEventListener('click', onBigPictureClose);
  commentsLoader.removeEventListener('click', onCommentsLoaderClick);
}

// Обработчик открытия модального окна
function onBigPictureOpen(pictureData) {
  // Заполняем данные фотографии
  bigPictureImage.src = pictureData.url;
  bigPictureImage.alt = pictureData.description;
  likesCountElement.textContent = pictureData.likes;
  socialCaption.textContent = pictureData.description;

  // Сохраняем комментарии для постраничной загрузки
  currentComments = pictureData.comments;
  commentsShown = 0;

  // Очищаем текущие комментарии
  socialComments.innerHTML = '';

  // Показываем блоки с комментариями (убираем hidden)
  socialCommentCount.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  // Отображаем первые 5 комментариев
  renderComments();

  // Показываем окно
  bigPictureModal.classList.remove('hidden');
  document.body.classList.add('modal-open');

  // Добавляем обработчики событий
  document.addEventListener('keydown', onDocumentKeydown);
  closeButton.addEventListener('click', onBigPictureClose);
  commentsLoader.addEventListener('click', onCommentsLoaderClick);
}

// Экспорт основного обработчика
export { onBigPictureOpen };
