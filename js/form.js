// Модуль формы загрузки изображения: валидация, предпросмотр и отправка данных
import { showSuccessMessage, showErrorMessage } from './messages.js';
import { initEffects, resetEffects } from './effects.js';
import { initScale, resetScale } from './scale.js';
import { sendData } from './api.js';

// Константы настроек формы и ограничений
const FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif'];
const MAX_HASHTAGS = 5;
const MAX_COMMENT_LENGTH = 140;

// Тексты ошибок валидации хэштегов
const ErrorText = {
  INVALID_COUNT: `Максимум ${MAX_HASHTAGS} хэштегов`,
  NOT_UNIQUE: 'Хэштеги должны быть уникальными',
  INVALID_PATTERN: 'Неправильный хэштег',
};

// DOM‑элементы формы и её дочерних блоков
const uploadForm = document.querySelector('.img-upload__form');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const uploadCancel = document.querySelector('.img-upload__cancel');
const fileChooser = document.querySelector('.img-upload__input');
const hashtagsInput = document.querySelector('.text__hashtags');
const descriptionInput = document.querySelector('.text__description');
const submitButton = document.querySelector('.img-upload__submit');
const previewImage = document.querySelector('.img-upload__preview img');
const effectsList = document.querySelector('.effects__list');

// Экземпляр Pristine для валидации формы
let pristine = null;

// Преобразование строки хэштегов в массив отдельных тегов
const normalizeTags = (tagString) => tagString.trim().split(' ').filter((tag) => Boolean(tag.length));

// Проверка количества хэштегов
const hasValidCount = (tags) => tags.length <= MAX_HASHTAGS;

// Проверка уникальности хэштегов (без учета регистра)
const hasUniqueTags = (tags) => {
  const lowerCaseTags = tags.map((tag) => tag.toLowerCase());
  return lowerCaseTags.length === new Set(lowerCaseTags).size;
};

// Проверка соответствия каждого хэштега шаблону
const hasValidTags = (tags) => tags.every((tag) => /^#[a-zа-яё0-9]{1,19}$/i.test(tag));

// Комплексная проверка хэштегов на основе вспомогательных проверок
const validateHashtags = (value) => {
  const tags = normalizeTags(value);
  return hasValidCount(tags) && hasUniqueTags(tags) && hasValidTags(tags);
};

// Получение текстового сообщения об ошибке хэштегов
const getHashtagError = (value) => {
  const tags = normalizeTags(value);
  if (!hasValidCount(tags)) {
    return ErrorText.INVALID_COUNT;
  }
  if (!hasUniqueTags(tags)) {
    return ErrorText.NOT_UNIQUE;
  }
  if (!hasValidTags(tags)) {
    return ErrorText.INVALID_PATTERN;
  }
  return '';
};

// Проверка максимальной длины комментария
const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

// Обработчик выбора файла: проверяет тип, показывает превью и открывает форму
const onFileChange = () => {
  const file = fileChooser.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((type) => fileName.endsWith(type));

  if (matches) {
    previewImage.src = URL.createObjectURL(file);
    if (effectsList) {
      const effectPreviews = effectsList.querySelectorAll('.effects__preview');
      effectPreviews.forEach((preview) => {
        preview.style.backgroundImage = `url(${previewImage.src})`;
      });
    }
    openForm();
  } else {
    showErrorMessage('Неверный формат файла');
  }
};

// Обработчик Esc: закрывает форму, если фокус не в полях ввода
const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape' && !evt.target.closest('.text__hashtags') && !evt.target.closest('.text__description')) {
    evt.preventDefault();
    closeForm();
  }
};

// Обработчик отправки формы: валидация, отправка данных и показ сообщения
const onFormSubmit = async (evt) => {
  evt.preventDefault();
  if (!pristine.validate()) {
    return;
  }

  submitButton.disabled = true;
  try {
    await sendData(new FormData(evt.target));
    showSuccessMessage();
    closeForm();
  } catch {
    showErrorMessage();
  } finally {
    submitButton.disabled = false;
  }
};

// Открытие модального окна формы и подписка на Esc
function openForm() {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
}

// Закрытие формы: сброс значений, эффектов, масштаба и превью
function closeForm() {
  uploadForm.reset();
  pristine.reset();
  resetScale();
  resetEffects();
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  if (previewImage.src) {
    URL.revokeObjectURL(previewImage.src);
    previewImage.src = '';
  }
  if (effectsList) {
    const effectPreviews = effectsList.querySelectorAll('.effects__preview');
    effectPreviews.forEach((preview) => {
      preview.style.backgroundImage = '';
    });
  }
}

// Инициализация Pristine и регистрация валидаторов полей формы
const initValidation = () => {
  pristine = new Pristine(uploadForm, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'img-upload__field-wrapper--error',
  });

  pristine.addValidator(hashtagsInput, validateHashtags, getHashtagError);
  pristine.addValidator(descriptionInput, validateComment, `Максимум ${MAX_COMMENT_LENGTH} символов`);
};

// Полная инициализация формы загрузки: валидация, масштаб, эффекты, обработчики
const initImageUpload = () => {
  initValidation();
  initScale();
  initEffects();
  fileChooser.addEventListener('change', onFileChange);
  uploadCancel.addEventListener('click', closeForm);
  uploadForm.addEventListener('submit', onFormSubmit);
};

// Экспорт функций инициализации и закрытия формы
export { initImageUpload, closeForm };
