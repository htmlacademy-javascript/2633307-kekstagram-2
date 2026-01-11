const effectLevel = document.querySelector('.img-upload__effect-level');
const effectSlider = document.querySelector('.effect-level__slider');
const effectValue = document.querySelector('.effect-level__value'); // Скрытое поле для сервера
const effectValueDisplay = effectLevel?.querySelector('.effect-level__value'); // Может быть отдельный элемент для отображения
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

// Текущее состояние эффекта
let currentEffect = 'none';

// ИНИЦИАЛИЗАЦИЯ СЛАЙДЕРА
function initSlider() {
  if (!effectSlider || typeof noUiSlider === 'undefined') {
    // eslint-disable-next-line no-console
    console.error('Библиотека noUiSlider не загружена или элемент не найден');
    return;
  }

  // Уничтожаем существующий слайдер, если он уже был создан
  if (effectSlider.noUiSlider) {
    effectSlider.noUiSlider.destroy();
  }

  // Инициализируем слайдер с базовыми настройками
  noUiSlider.create(effectSlider, {
    range: {
      min: 0,
      max: 100
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: (value) =>
        // Для отправки на сервер всегда используем числа
        Number(value).toFixed(1)
      ,
      from: (value) => parseFloat(value)
    }
  });

  // Обработчик обновления слайдера
  effectSlider.noUiSlider.on('update', (values, handle) => {
    const sliderValue = values[handle];

    //  Записываем значение в скрытое поле для отправки на сервер
    if (effectValue) {
      effectValue.value = sliderValue;
    }

    // Если есть отдельный элемент для отображения, обновляем его
    if (effectValueDisplay) {
      effectValueDisplay.textContent = `${sliderValue}%`;
    }

    // Применяем эффект к изображению
    applyEffect(sliderValue);
  });
}

// Применение эффекта к изображению
function applyEffect(sliderValue) {
  if (!imagePreview || currentEffect === 'none') {
    return;
  }

  const effect = Effects[currentEffect];
  const value = parseFloat(sliderValue);

  // Вычисляем значение для CSS фильтра
  let cssValue;
  const unit = effect.unit;

  if (currentEffect === 'marvin') {
    // Для инвертирования: 0-100%
    cssValue = Math.round(value);
  } else if (currentEffect === 'phobos') {
    // Для размытия: 0-100 -> 0-3px
    cssValue = (value / 100) * effect.max;
    cssValue = cssValue.toFixed(1);
  } else if (currentEffect === 'heat') {
    // Для яркости: 0-100 -> 1-3
    cssValue = effect.min + (value / 100) * (effect.max - effect.min);
    cssValue = cssValue.toFixed(1);
  } else {
    // Для grayscale и sepia: 0-100 -> 0-1
    cssValue = (value / 100) * effect.max;
    cssValue = cssValue.toFixed(1);
  }

  // Применяем визуальный эффект к изображению
  imagePreview.style.filter = `${effect.filter}(${cssValue}${unit})`;
}

//  УПРАВЛЕНИЕ ЭФФЕКТАМИ
function updateSliderForEffect(effectName) {
  const effect = Effects[effectName];

  if (effectName === 'none') {
    // Скрываем слайдер и сбрасываем эффект
    effectLevel.classList.add('hidden');
    if (imagePreview) {
      imagePreview.style.filter = 'none';
    }

    // Очищаем значение в скрытом поле
    if (effectValue) {
      effectValue.value = '';
    }

    currentEffect = 'none';
    return;
  }

  // Показываем слайдер
  effectLevel.classList.remove('hidden');

  // Обновляем настройки слайдера для нового эффекта
  if (effectSlider.noUiSlider) {
    const isMarvin = effectName === 'marvin';

    // Вычисляем правильные диапазоны для слайдера
    const sliderMin = effect.min * (isMarvin ? 1 : 100);
    const sliderMax = effect.max * (isMarvin ? 1 : 100);
    const sliderStep = effect.step * (isMarvin ? 1 : 100);

    // Обновляем опции слайдера
    effectSlider.noUiSlider.updateOptions({
      range: {
        min: sliderMin,
        max: sliderMax
      },
      start: sliderMax, // Всегда начинаем с максимальной интенсивности
      step: sliderStep,
      format: {
        to: (value) => {
          // Для инвертирования округляем до целого
          if (effectName === 'marvin') {
            return Math.round(value);
          }
          // Для остальных эффектов - одно десятичное значение
          return Number(value).toFixed(1);
        },
        from: (value) => parseFloat(value)
      }
    });

    //  Обновляем значение в скрытом поле
    if (effectValue) {
      effectValue.value = sliderMax.toString();
    }
  }

  currentEffect = effectName;

  // Применяем эффект с максимальной интенсивностью
  if (effectSlider.noUiSlider) {
    const sliderMax = effect.max * (effectName === 'marvin' ? 1 : 100);
    applyEffect(sliderMax);
  }
}

//  СБРОС ЭФФЕКТОВ
function resetEffects() {
  currentEffect = 'none';

  // Скрываем слайдер
  if (effectLevel) {
    effectLevel.classList.add('hidden');
  }

  // Сбрасываем фильтр изображения
  if (imagePreview) {
    imagePreview.style.filter = 'none';
  }

  // Очищаем значение в скрытом поле для сервера
  if (effectValue) {
    effectValue.value = '';
  }

  // Сбрасываем слайдер к базовому состоянию
  if (effectSlider && effectSlider.noUiSlider) {
    effectSlider.noUiSlider.updateOptions({
      range: {
        min: 0,
        max: 100
      },
      start: 100,
      step: 1,
      format: {
        to: (value) => Number(value).toFixed(1),
        from: (value) => parseFloat(value)
      }
    });

    // Обновляем значение в скрытом поле
    if (effectValue) {
      effectValue.value = '100';
    }
  }

  // Сбрасываем радиокнопку к эффекту "none"
  const effectNone = document.querySelector('#effect-none');
  if (effectNone) {
    effectNone.checked = true;
  }
}

// ОБРАБОТЧИК СОБЫТИЙ
function onEffectChange(evt) {
  if (evt.target.type === 'radio' && evt.target.name === 'effect') {
    updateSliderForEffect(evt.target.value);
  }
}

// ========== ОБЩИЕ ГЕТТЕРЫ ==========

//  ИНИЦИАЛИЗАЦИЯ МОДУЛЯ
function initEffects() {
  // Проверяем необходимые элементы
  if (!effectLevel || !effectSlider || !effectValue || !imagePreview) {
    // eslint-disable-next-line no-console
    console.error('Не все необходимые элементы найдены в DOM');
    return;
  }

  // Инициализируем слайдер
  initSlider();

  // Сбрасываем к начальному состоянию
  resetEffects();

  // Добавляем обработчик для списка эффектов
  const effectsList = document.querySelector('.effects__list');
  if (effectsList) {
    effectsList.addEventListener('change', onEffectChange);
  }

  return {
    reset: resetEffects,

  };
}

export { initEffects, resetEffects, onEffectChange };
