

const effectLevel = document.querySelector('.img-upload__effect-level');
const effectSlider = document.querySelector('.effect-level__slider');
const effectValue = document.querySelector('.effect-level__value');
const imagePreview = document.querySelector('.img-upload__preview img');

// Конфигурация эффектов
const Effects = {
  'chrome': {
    filter: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  'sepia': {
    filter: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  'marvin': {
    filter: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%'
  },
  'phobos': {
    filter: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px'
  },
  'heat': {
    filter: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: ''
  },
  'none': {
    filter: 'none',
    min: 0,
    max: 100,
    step: 1,
    unit: ''
  }
};

// Состояние
let currentEffect = 'none';
let effectIntensity = 100;

// ========== ИНИЦИАЛИЗАЦИЯ СЛАЙДЕРА ==========
function initSlider() {
  if (!effectSlider || typeof noUiSlider === 'undefined') {
    // eslint-disable-next-line no-console
    console.error('Библиотека noUiSlider не загружена или элемент не найден');
    return;
  }

  noUiSlider.create(effectSlider, {
    range: {
      min: 0,
      max: 100
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: (value) => Number(value).toFixed(0),
      from: (value) => parseFloat(value)
    }
  });

  effectSlider.noUiSlider.on('update', () => {
    const value = effectSlider.noUiSlider.get();
    effectValue.value = value;
    effectValue.textContent = `${value}%`;
    effectIntensity = parseFloat(value);
    applyEffect();
  });
}

// ========== УПРАВЛЕНИЕ ЭФФЕКТАМИ ==========
function updateSliderForEffect(effectName) {
  const effect = Effects[effectName];

  if (effectName === 'none') {
    effectLevel.classList.add('hidden');
    if (imagePreview) {
      imagePreview.style.filter = '';
    }
    effectValue.value = '';
    currentEffect = 'none';
    return;
  }

  effectLevel.classList.remove('hidden');

  effectSlider.noUiSlider.updateOptions({
    range: {
      min: effect.min * 100,
      max: effect.max * 100
    },
    start: effect.max * 100,
    step: effect.step * 100
  });

  currentEffect = effectName;
  effectIntensity = effect.max * 100;
  applyEffect();
}

function applyEffect() {
  if (!imagePreview || currentEffect === 'none') {
    return;
  }

  const effect = Effects[currentEffect];
  const normalizedValue = effectIntensity / 100;
  const filterValue = (effect.min + (effect.max - effect.min) * normalizedValue).toFixed(1);

  imagePreview.style.filter = `${effect.filter}(${filterValue}${effect.unit})`;
}

function resetEffects() {
  currentEffect = 'none';
  effectIntensity = 100;

  if (effectLevel) {
    effectLevel.classList.add('hidden');
  }

  if (imagePreview) {
    imagePreview.style.filter = '';
  }

  // Сбрасываем радиокнопку к эффекту "none"
  const effectNone = document.querySelector('#effect-none');
  if (effectNone) {
    effectNone.checked = true;
  }
}

// ========== ОБРАБОТЧИК СОБЫТИЙ ==========
function onEffectChange(evt) {
  if (evt.target.name === 'effect') {
    updateSliderForEffect(evt.target.value);
  }
}

// ========== ОБЩИЕ ГЕТТЕРЫ ==========
function getCurrentEffect() {
  return currentEffect;
}

function getEffectIntensity() {
  return effectIntensity;
}

// ========== ИНИЦИАЛИЗАЦИЯ МОДУЛЯ ==========
function initEffects() {
  initSlider();
  resetEffects();

  // Добавляем обработчик для списка эффектов
  const effectsList = document.querySelector('.effects__list');
  if (effectsList) {
    effectsList.addEventListener('change', onEffectChange);
  }

  return {
    reset: resetEffects,
    getCurrentEffect,
    getEffectIntensity
  };
}

export { initEffects, resetEffects, getCurrentEffect, getEffectIntensity, onEffectChange };
