const fullPictureModal = document.querySelector('.big-picture');
const closeButton = fullPictureModal.querySelector('.big-picture__cancel');
const socialComments = fullPictureModal.querySelector('.social__comments');
const socialCommentCount = fullPictureModal.querySelector('.social__comment-count');
const commentsLoader = fullPictureModal.querySelector('.comments-loader');
const likesCountElement = fullPictureModal.querySelector('.likes-count');
const socialCommentShownCount = fullPictureModal.querySelector('.social__comment-shown-count');
const socialCommentTotalCount = fullPictureModal.querySelector('.social__comment-total-count');
const socialCaption = fullPictureModal.querySelector('.social__caption');
const bigPictureImage = fullPictureModal.querySelector('.big-picture__img img');

// Функция для создания элемента комментария
function createCommentElement(comment) {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const commentAvatar = document.createElement('img');
  commentAvatar.classList.add('social__picture');
  commentAvatar.src = comment.avatar;
  commentAvatar.alt = comment.name;
  commentAvatar.width = 35;
  commentAvatar.height = 35;

  const commentText = document.createElement('p');
  commentText.classList.add('social__text');
  commentText.textContent = comment.message;

  commentElement.appendChild(commentAvatar);
  commentElement.appendChild(commentText);

  return commentElement;
}

// Функция для отрисовки комментариев
function renderComments(comments) {
  socialComments.innerHTML = '';

  const fragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    fragment.appendChild(commentElement);
  });

  socialComments.appendChild(fragment);
}

// Обработчик нажатия клавиши Esc
function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeFullPicture();
  }
}

// Функция для закрытия модального окна
function closeFullPicture() {
  fullPictureModal.classList.add('hidden');
  document.body.classList.remove('modal-open');

  // Удаляем обработчики событий
  document.removeEventListener('keydown', onDocumentKeydown);
}

// Функция для открытия модального окна
function openFullPicture(pictureData) {
  // Заполняем данные фотографии
  bigPictureImage.src = pictureData.url;
  bigPictureImage.alt = pictureData.description;
  likesCountElement.textContent = pictureData.likes;
  socialCommentTotalCount.textContent = pictureData.comments.length;
  socialCommentShownCount.textContent = pictureData.comments.length;
  socialCaption.textContent = pictureData.description;

  // Отображаем комментарии
  renderComments(pictureData.comments);

  // Скрываем счетчик комментариев и кнопку загрузки
  socialCommentCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');

  // Показываем окно
  fullPictureModal.classList.remove('hidden');
  document.body.classList.add('modal-open');

  // Добавляем обработчики событий
  document.addEventListener('keydown', onDocumentKeydown);
  closeButton.addEventListener('click', closeFullPicture);
}

export { openFullPicture };
