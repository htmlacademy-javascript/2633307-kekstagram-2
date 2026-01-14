// Модуль показа большой версии фотографии и постраничной загрузки комментариев
const COMMENTS_PER_LOAD = 5;

// DOM‑элементы модального окна большой фотографии
const bigPictureModal = document.querySelector('.big-picture');
const closeButton = bigPictureModal.querySelector('.big-picture__cancel');
const socialComments = bigPictureModal.querySelector('.social__comments');
const socialCommentCount = bigPictureModal.querySelector('.social__comment-count');
const commentsLoader = bigPictureModal.querySelector('.comments-loader');
const likesCountElement = bigPictureModal.querySelector('.likes-count');
const socialCommentShownCount = bigPictureModal.querySelector('.social__comment-shown-count');
const socialCommentTotalCount = bigPictureModal.querySelector('.social__comment-total-count');
const socialCaption = bigPictureModal.querySelector('.social__caption');
const bigPictureImage = bigPictureModal.querySelector('.big-picture__img img');

// Состояние списка комментариев и количества уже показанных
let currentComments = [];
let commentsShown = 0;

// Создание DOM‑элемента отдельного комментария
const createCommentElement = ({ avatar, name, message }) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');
  commentElement.innerHTML = `
    <img class="social__picture" src="${avatar}" alt="${name}" width="35" height="35">
    <p class="social__text">${message}</p>
  `;
  return commentElement;
};

// Обновление счетчиков «показано/всего» комментариев
const updateCommentCounter = () => {
  socialCommentShownCount.textContent = commentsShown;
  socialCommentTotalCount.textContent = currentComments.length;
};

// Отрисовка очередной порции комментариев и управление кнопкой «загрузить ещё»
const renderComments = () => {
  const commentsToShow = currentComments.slice(commentsShown, commentsShown + COMMENTS_PER_LOAD);
  const fragment = document.createDocumentFragment();

  commentsToShow.forEach((comment) => {
    fragment.appendChild(createCommentElement(comment));
  });

  socialComments.appendChild(fragment);
  commentsShown += commentsToShow.length;

  updateCommentCounter();

  if (commentsShown >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

// Обработчик клика по кнопке подгрузки комментариев
const onCommentsLoaderClick = () => renderComments();

// Обработчик Esc для закрытия модального окна
const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    onBigPictureClose();
  }
};

// Закрытие модального окна и сброс состояния комментариев
function onBigPictureClose() {
  bigPictureModal.classList.add('hidden');
  document.body.classList.remove('modal-open');

  commentsShown = 0;
  currentComments = [];
  socialComments.innerHTML = '';

  document.removeEventListener('keydown', onDocumentKeydown);
  closeButton.removeEventListener('click', onBigPictureClose);
  commentsLoader.removeEventListener('click', onCommentsLoaderClick);
}

// Открытие модального окна с заполнением данными выбранной фотографии
const onBigPictureOpen = (pictureData) => {
  bigPictureImage.src = pictureData.url;
  bigPictureImage.alt = pictureData.description;
  likesCountElement.textContent = pictureData.likes;
  socialCaption.textContent = pictureData.description;

  currentComments = pictureData.comments;
  commentsShown = 0;
  socialComments.innerHTML = '';

  socialCommentCount.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  renderComments();

  bigPictureModal.classList.remove('hidden');
  document.body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
  closeButton.addEventListener('click', onBigPictureClose);
  commentsLoader.addEventListener('click', onCommentsLoaderClick);
};

export { onBigPictureOpen };
