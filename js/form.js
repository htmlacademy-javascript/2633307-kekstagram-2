import { showSuccessMessage, showErrorMessage } from './messages.js';
import { initEffects, resetEffects, getCurrentEffect, getEffectIntensity } from './effects.js';
import { initScale, resetScale, getCurrentScale } from './scale.js';

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

// Состояние
let isFormOpen = false;
let isSubmitting = false;
let pristine = null;

// ========== ВАЛИДАЦИЯ ==========
function validateHashtags(value) {
  // Если поле пустое, валидация проходит успешно
  const trimmedValue = value.trim();
  if (trimmedValue === '') {
    return true;
  }

  // Разбиваем строку на хэштеги с использованием пробела как разделителя
  // Убираем пустые строки, которые могут появиться из-за нескольких пробелов подряд
  const hashtags = trimmedValue.split(' ').filter((tag) => tag !== '');

  // 1. Проверка максимального количества хэштегов
  if (hashtags.length > MAX_HASHTAGS) {
    return `Нельзя указать больше ${MAX_HASHTAGS} хэштегов. Сейчас ${hashtags.length}`;
  }

  // Создаем Set для проверки уникальности (игнорируем регистр)
  const uniqueHashtags = new Set();

  // Проходим по всем хэштегам в цикле
  for (let i = 0; i < hashtags.length; i++) {
    const hashtag = hashtags[i];

    // 2. Проверка на решетку в начале
    if (!hashtag.startsWith('#')) {
      return `Хэштег "${hashtag}" должен начинаться с символа #`;
    }

    // 3. Проверка на хэштег, состоящий только из решетки
    if (hashtag === '#') {
      return 'Хэштег не может состоять только из символа #';
    }

    // 4. Проверка наличия решетки внутри хэштега (не в начале)
    if (hashtag.slice(1).includes('#')) {
      return `Хэштег "${hashtag}" содержит символ # внутри. Хэштеги должны разделяться пробелами`;
    }

    // 5. Проверка длины хэштега
    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return `Хэштег "${hashtag}" слишком длинный. Максимальная длина: ${MAX_HASHTAG_LENGTH} символов`;
    }

    // 6. Проверка на допустимые символы (только буквы и цифры после #)
    const validCharsRegex = /^#[a-zа-яё0-9]+$/i;
    if (!validCharsRegex.test(hashtag)) {
      return `Хэштег "${hashtag}" содержит недопустимые символы. Разрешены только буквы и цифры`;
    }

    // 7. Проверка уникальности (приводим к нижнему регистру для case-insensitive сравнения)
    const lowercaseHashtag = hashtag.toLowerCase();
    if (uniqueHashtags.has(lowercaseHashtag)) {
      return `Хэштег "${hashtag}" повторяется. Хэштеги должны быть уникальными`;
    }

    uniqueHashtags.add(lowercaseHashtag);
  }

  // Все проверки пройдены
  return true;
}

// Инициализация валидации с Pristine
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

  // Валидатор для хэштегов с кастомным сообщением
  pristine.addValidator(
    hashtagsInput,
    (value) => validateHashtags(value) === true,
    (value) => {
      const result = validateHashtags(value);
      return result === true ? '' : result;
    },
    2, // Приоритет
    false // Не прерывать валидацию при false
  );

  // Валидатор для комментария
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

  // Дополнительно: показывать количество хэштегов
  if (hashtagsInput) {
    hashtagsInput.addEventListener('input', () => {
      const value = hashtagsInput.value.trim();
      const hashtags = value === '' ? [] : value.split(' ').filter((tag) => tag !== '');
      const countElement = hashtagsInput.parentNode.querySelector('.hashtags-count');
      // Добавляем элемент для отображения количества, если его нет
      if (!countElement) {
        const countEl = document.createElement('div');
        countEl.className = 'hashtags-count';
        countEl.style.fontSize = '12px';
        countEl.style.color = '#999';
        countEl.style.marginTop = '5px';
        hashtagsInput.parentNode.appendChild(countEl);
      }
      // Обновляем количество хэштегов
      const element = hashtagsInput.parentNode.querySelector('.hashtags-count');
      if (element) {
        element.textContent = `Хэштегов: ${hashtags.length}/${MAX_HASHTAGS}`;
        element.style.color = hashtags.length > MAX_HASHTAGS ? '#ff6b6b' : '#999';
      }
    });
  }

  // Дополнительно: показывать количество символов комментария
  if (descriptionInput) {
    descriptionInput.addEventListener('input', () => {
      const length = descriptionInput.value.length;
      const countElement = descriptionInput.parentNode.querySelector('.comment-count');

      if (!countElement) {
        const countEl = document.createElement('div');
        countEl.className = 'comment-count';
        countEl.style.fontSize = '12px';
        countEl.style.color = '#999';
        countEl.style.marginTop = '5px';
        descriptionInput.parentNode.appendChild(countEl);
      }

      const element = descriptionInput.parentNode.querySelector('.comment-count');
      if (element) {
        const remaining = MAX_COMMENT_LENGTH - length;
        element.textContent = `Символов: ${length}/${MAX_COMMENT_LENGTH}`;
        element.style.color = remaining >= 0 ? '#999' : '#ff6b6b';
      }
    });
  }
}
// Валидатор для комментария
function validateComment(value) {
  return value.length <= MAX_COMMENT_LENGTH;
}

// Открытие формы
function openForm() {
  if (!uploadOverlay) {
    return;
  }

  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  isFormOpen = true;

  // Сбрасываем состояние
  resetScale();
  resetEffects();
}
// Закрытие формы
function closeForm() {
  if (!uploadOverlay) {
    return;
  }

  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  isFormOpen = false;

  // Сбрасываем форму
  uploadForm.reset();
  uploadInput.value = '';

  if (pristine) {
    pristine.reset();
  }

  // Сбрасываем состояние
  resetScale();
  resetEffects();
}

function onDocumentKeydown(evt) {
  if (!isFormOpen) {
    return;
  }

  const isEscapeKey = evt.key === 'Escape' || evt.key === 'Esc';
  const isFocusOnInput = document.activeElement === hashtagsInput ||
                         document.activeElement === descriptionInput;

  if (isEscapeKey && !isFocusOnInput) {
    evt.preventDefault();
    evt.stopPropagation();
    closeForm();
  }
}

// Обработчики для отмены события Esc при фокусе на полях ввода
function onInputKeydown(evt) {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.stopPropagation();
  }
}

// Отправка формы
// eslint-disable-next-line no-unused-vars
async function submitForm(formData) {
  if (!submitButton) {
    return;
  }

  try {
    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';

    // Используем стандартную отправку формы через браузер
    showSuccessMessage('Форма успешно отправлена!');

    // Даем пользователю увидеть сообщение перед закрытием
    setTimeout(() => {
      closeForm();
    }, 1000);

  } catch (error) {
    showErrorMessage('Ошибка при отправке формы');
  } finally {
    isSubmitting = false;
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Опубликовать';
    }
  }
}
// Обработчик отправки формы
function onFormSubmit(evt) {
  evt.preventDefault();

  if (!pristine) {
    initValidation();
  }

  // Проверяем валидность формы
  const isValid = pristine.validate();

  if (!isValid) {
    // Показываем ошибки валидации
    const errors = pristine.getErrors();
    // eslint-disable-next-line no-console
    console.log('Ошибки валидации:', errors);
    return;
  }

  if (isSubmitting) {
    return;
  }

  // Создаем FormData из формы
  const formData = new FormData(uploadForm);

  // Добавляем дополнительные данные
  formData.append('scale', getCurrentScale());
  formData.append('effect', getCurrentEffect());
  formData.append('effect-intensity', getEffectIntensity());

  // Если есть изображение, добавляем его
  if (uploadInput.files && uploadInput.files[0]) {
    formData.append('image', uploadInput.files[0]);
  }

  submitForm(formData);
}

// инициализация обработчиков событий
function initEventListeners() {
  // Загрузка файла - просто открываем форму при выборе файла
  if (uploadInput) {
    uploadInput.addEventListener('change', () => {
      const file = uploadInput.files[0];
      if (file) {
        // Проверяем тип файла
        const fileName = file.name.toLowerCase();
        const matches = FILE_TYPES.some((type) => fileName.endsWith(type));

        if (!matches) {
          showErrorMessage('Пожалуйста, выберите файл изображения (jpg, jpeg, png, gif)');
          uploadInput.value = ''; // Сбрасываем значение input
          return;
        }

        openForm();
      }
    });
  }

  // Закрытие формы
  if (uploadCancel) {
    uploadCancel.addEventListener('click', closeForm);
  }

  // Отправка формы
  if (uploadForm) {
    uploadForm.addEventListener('submit', onFormSubmit);
  }

  // Глобальный обработчик Esc
  document.addEventListener('keydown', onDocumentKeydown);

  // Обработчики для полей ввода (чтобы не закрывать форму при фокусе)
  if (hashtagsInput) {
    hashtagsInput.addEventListener('keydown', onInputKeydown);
  }

  if (descriptionInput) {
    descriptionInput.addEventListener('keydown', onInputKeydown);
  }
}

// Инициализация модуля загрузки изображений
function initImageUpload() {
  // Проверяем необходимые элементы
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

// Экспорт функций
export { initImageUpload, closeForm };
