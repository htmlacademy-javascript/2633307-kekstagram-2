// Модуль применения визуальных эффектов (фильтров) к превью изображения
const effectLevel = document.querySelector('.img-upload__effect-level');
const effectSlider = document.querySelector('.effect-level__slider');
const effectValue = document.querySelector('.effect-level__value');
const imagePreview = document.querySelector('.img-upload__preview img');
const effectsList = document.querySelector('.effects__list');

// Конфигурация доступных эффектов и их параметров для слайдера
const Effects = {
  chrome: {
    filter: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  sepia: {
    filter: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  marvin: {
    filter: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },
  phobos: {
    filter: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px',
  },
  heat: {
    filter: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: '',
  },
  none: {
    filter: 'none',
    min: 0,
    max: 100,
    step: 1,
    unit: '',
  },
};

// Текущее выбранное значение эффекта
let currentEffect = 'none';

// Проверка, активен ли «нулевой» эффект без фильтрации
const isDefault = () => currentEffect === 'none';

// Обновление параметров слайдера под текущий эффект
const updateSlider = () => {
  if (isDefault()) {
    effectLevel.classList.add('hidden');
    return;
  }

  effectLevel.classList.remove('hidden');
  const { min, max, step } = Effects[currentEffect];

  effectSlider.noUiSlider.updateOptions({
    range: { min, max },
    start: max,
    step,
  });
};

// Обновление фильтра изображения при изменении значения слайдера
const onSliderUpdate = () => {
  if (isDefault()) {
    imagePreview.style.filter = 'none';
    return;
  }

  const sliderValue = effectSlider.noUiSlider.get();
  effectValue.value = sliderValue;
  const { filter, unit } = Effects[currentEffect];
  imagePreview.style.filter = `${filter}(${sliderValue}${unit})`;
};

// Обработчик выбора эффекта по радиокнопкам
const onEffectChange = (evt) => {
  if (!evt.target.matches('input[type="radio"]')) {
    return;
  }
  currentEffect = evt.target.value;
  imagePreview.className = `effects__preview--${currentEffect}`;
  updateSlider();
};

// Инициализация noUiSlider с базовыми настройками
const initSlider = () => {
  if (!effectSlider) {
    return;
  }

  noUiSlider.create(effectSlider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: (value) => Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1),
      from: (value) => parseFloat(value),
    },
  });

  effectSlider.noUiSlider.on('update', onSliderUpdate);
};

// Сброс эффектов к состоянию «без фильтра» и очистка значений
const resetEffects = () => {
  currentEffect = 'none';
  if (effectSlider && effectSlider.noUiSlider) {
    updateSlider();
  }
  if (imagePreview) {
    imagePreview.style.filter = 'none';
    imagePreview.className = '';
  }
  if (effectValue) {
    effectValue.value = '';
  }
  const defaultEffect = document.querySelector('#effect-none');
  if (defaultEffect) {
    defaultEffect.checked = true;
  }
};

// Инициализация модуля эффектов и подписка на изменения списка эффектов
const initEffects = () => {
  initSlider();
  updateSlider();
  if (effectsList) {
    effectsList.addEventListener('change', onEffectChange);
  }
};
export { initEffects, resetEffects };
