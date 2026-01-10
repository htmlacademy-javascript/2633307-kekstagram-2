import { showSuccessMessage, showErrorMessage } from './messages.js';
import { initEffects, resetEffects, getCurrentEffect, getEffectIntensity} from './effects.js';
import { initScale, resetScale, getCurrentScale } from './scale.js';
import { sendData } from './api.js';

const FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif'];
const MAX_HASHTAGS = 5;
const MAX_HASHTAG_LENGTH = 20;
const MAX_COMMENT_LENGTH = 140;

// DOM элементы
const uploadInput = document.querySelector('.img-upload__input');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const uploadCancel = document.querySelector('.img-upload__cancel');
const uploadForm = document.querySelector('.img-upload__form');
const hashtagsInput = document.querySelector('.text__hashtags');
const descriptionInput = document.querySelector('.text__description');
const submitButton = document.querySelector('.img-upload__submit');
const previewImage = document.querySelector('.img-upload__preview img');
const fileChooser = document.querySelector('.img-upload__input');
const effectsList = document.querySelector('.effects__list');
const scaleControl = document.querySelector('.scale__control--value');

// Состояние
let isFormOpen = false;
let isSubmitting = false;
let pristine = null;

// ========== ОБРАБОТКА ВЫБОРА ФАЙЛА ==========
const onFileChange = () => {
  const file = fileChooser.files[0];
  if (!file) {
    return;
  }


  // Проверка типа файла
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((type) => fileName.endsWith(type));

  if (!matches) {
    showErrorMessage('Пожалуйста, выберите файл изображения (jpg, jpeg, png, gif)');
    fileChooser.value = '';
    return;
  }

  // Показываем превью
  const reader = new FileReader();

  reader.addEventListener('load', () => {
    previewImage.src = reader.result;
  });

  reader.readAsDataURL(file);

  // Открываем форму
  openForm();
};

// ========== ВАЛИДАЦИЯ ==========
function validateHashtags(value) {
  const trimmedValue = value.trim();
  if (trimmedValue === '') {
    return true;
  }

  const hashtags = trimmedValue.split(' ').filter((tag) => tag !== '');

  if (hashtags.length > MAX_HASHTAGS) {
    return `Нельзя указать больше ${MAX_HASHTAGS} хэштегов. Сейчас ${hashtags.length}`;
  }

  const uniqueHashtags = new Set();

  for (let i = 0; i < hashtags.length; i++) {
    const hashtag = hashtags[i];

    if (!hashtag.startsWith('#')) {
      return `Хэштег "${hashtag}" должен начинаться с символа #`;
    }

    if (hashtag === '#') {
      return 'Хэштег не может состоять только из символа #';
    }

    if (hashtag.slice(1).includes('#')) {
      return `Хэштег "${hashtag}" содержит символ # внутри. Хэштеги должны разделяться пробелами`;
    }

    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return `Хэштег "${hashtag}" слишком длинный. Максимальная длина: ${MAX_HASHTAG_LENGTH} символов`;
    }

    const validCharsRegex = /^#[a-zа-яё0-9]+$/i;
    if (!validCharsRegex.test(hashtag)) {
      return `Хэштег "${hashtag}" содержит недопустимые символы. Разрешены только буквы и цифры`;
    }

    const lowercaseHashtag = hashtag.toLowerCase();
    if (uniqueHashtags.has(lowercaseHashtag)) {
      return `Хэштег "${hashtag}" повторяется. Хэштеги должны быть уникальными`;
    }

    uniqueHashtags.add(lowercaseHashtag);
  }

  return true;
}

function validateComment(value) {
  return value.length <= MAX_COMMENT_LENGTH;
}

// Инициализация валидации
function initValidation() {
  if (typeof Pristine === 'undefined') {
    // eslint-disable-next-line no-console
    console.error('Библиотека Pristine не загружена');
    return;
  }

  pristine = new Pristine(uploadForm, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--error',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'pristine-error'
  });

  pristine.addValidator(
    hashtagsInput,
    (value) => validateHashtags(value) === true,
    (value) => {
      const result = validateHashtags(value);
      return result === true ? '' : result;
    },
    2,
    false
  );

  pristine.addValidator(
    descriptionInput,
    validateComment,
    (value) => {
      const remaining = MAX_COMMENT_LENGTH - value.length;
      if (remaining >= 0) {
        return `Осталось символов: ${remaining}`;
      }
      return `Превышено на ${Math.abs(remaining)} символов из ${MAX_COMMENT_LENGTH}`;
    },
    1,
    false
  );
}

// ========== УПРАВЛЕНИЕ ФОРМОЙ ==========
function openForm() {
  if (!uploadOverlay) {
    return;
  }

  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  isFormOpen = true;

  // Инициализируем компоненты при открытии
  if (!pristine) {
    initValidation();
  }
}

// Полный сброс формы к исходному состоянию
function resetForm() {
  // Сбрасываем форму
  uploadForm.reset();
  uploadInput.value = '';

  // Сбрасываем превью
  if (previewImage) {
    previewImage.src = '';
    previewImage.style.transform = '';
    previewImage.style.filter = '';
  }

  // Сбрасываем валидацию
  if (pristine) {
    pristine.reset();
  }

  // Сбрасываем масштаб
  resetScale();

  // Сбрасываем эффекты
  resetEffects();

  // Сбрасываем радиокнопку эффекта на "Оригинал"
  if (effectsList) {
    const noneEffect = effectsList.querySelector('#effect-none');
    if (noneEffect) {
      noneEffect.checked = true;
    }
  }

  // Сбрасываем значение масштаба в инпуте
  if (scaleControl) {
    scaleControl.value = '100%';
  }
}

function closeForm() {
  if (!uploadOverlay) {
    return;
  }

  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  isFormOpen = false;

  // Полный сброс формы
  resetForm();
}

// ========== ОБРАБОТЧИКИ КЛАВИАТУРЫ ==========
function onDocumentKeydown(evt) {
  if (!isFormOpen) {
    return;
  }

  const isEscapeKey = evt.key === 'Escape' || evt.key === 'Esc';
  const isFocusOnInput = document.activeElement === hashtagsInput ||
                         document.activeElement === descriptionInput;

  if (isEscapeKey && !isFocusOnInput) {
    evt.preventDefault();
    closeForm();
  }
}

function onInputKeydown(evt) {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.stopPropagation();
  }
}

// ========== ОТПРАВКА ФОРМЫ НА СЕРВЕР ==========
async function submitForm(formData) {
  if (!submitButton) {
    return;
  }

  try {
    // Блокируем кнопку отправки
    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';

    // Отправляем данные на сервер
    await sendData(formData);

    // Успешная отправка - показываем сообщение
    showSuccessMessage('Изображение успешно загружено!');

    // Закрываем форму после успешной отправки
    closeForm();

  } catch (error) {
    // Показываем сообщение об ошибке
    showErrorMessage(error.message);

    // Разблокируем кнопку для повторной отправки
    isSubmitting = false;
    submitButton.disabled = false;
    submitButton.textContent = 'Опубликовать';

  } finally {
    // Гарантируем разблокировку кнопки в любом случае
    if (isSubmitting) {
      isSubmitting = false;
    }
  }
}

// Обработчик отправки формы
function onFormSubmit(evt) {
  evt.preventDefault();
  evt.stopPropagation();

  if (!pristine) {
    initValidation();
  }

  // Проверяем валидность формы
  const isValid = pristine.validate();

  if (!isValid || isSubmitting) {
    return;
  }

  // Создаем FormData из формы
  const formData = new FormData(uploadForm);

  // Добавляем дополнительные данные
  formData.append('scale', getCurrentScale());
  formData.append('effect', getCurrentEffect());
  formData.append('effect-intensity', getEffectIntensity());

  // Отправляем форму
  submitForm(formData);
}

// ========== ИНИЦИАЛИЗАЦИЯ ОБРАБОТЧИКОВ ==========
function initEventListeners() {
  // Загрузка файла
  if (fileChooser) {
    fileChooser.addEventListener('change', onFileChange);
  }

  // Закрытие формы по кнопке
  if (uploadCancel) {
    uploadCancel.addEventListener('click', closeForm);
  }

  // Отправка формы
  if (uploadForm) {
    uploadForm.addEventListener('submit', onFormSubmit);
  }

  // Глобальный обработчик Esc
  document.addEventListener('keydown', onDocumentKeydown);

  // Обработчики для предотвращения закрытия формы при фокусе на полях ввода
  if (hashtagsInput) {
    hashtagsInput.addEventListener('keydown', onInputKeydown);
  }

  if (descriptionInput) {
    descriptionInput.addEventListener('keydown', onInputKeydown);
  }
}

// ========== ИНИЦИАЛИЗАЦИЯ МОДУЛЯ ==========
function initImageUpload() {
  if (!uploadForm || !uploadInput || !uploadOverlay) {
    // eslint-disable-next-line no-console
    console.error('Не найдены необходимые элементы формы');
    return;
  }

  // Инициализируем компоненты
  initScale();
  initEffects();
  initValidation();
  initEventListeners();
}

export { initImageUpload, closeForm, resetForm };
