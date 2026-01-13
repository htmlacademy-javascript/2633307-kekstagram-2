const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const scaleValue = document.querySelector('.scale__control--value');
const imagePreview = document.querySelector('.img-upload__preview img');
// Константы масштаба
const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;
// Текущее значение масштаба
let currentScale = SCALE_DEFAULT;
// Функция для обновления масштаба изображения
function updateScale(value) {
  currentScale = Math.max(SCALE_MIN, Math.min(SCALE_MAX, value));
  scaleValue.value = `${currentScale}%`;

  if (imagePreview) {
    imagePreview.style.transform = `scale(${currentScale / 100})`;
  }
}
// Обработчики кликов по кнопкам управления масштабом
function onScaleDownClick() {
  updateScale(currentScale - SCALE_STEP);
}

function onScaleUpClick() {
  updateScale(currentScale + SCALE_STEP);
}
// Функция для сброса масштаба к значению по умолчанию

function resetScale() {
  currentScale = SCALE_DEFAULT;
  updateScale(SCALE_DEFAULT);
}

// Инициализация управления масштабом
function initScale() {
  resetScale();
  // Добавление обработчика для кнопки уменьшения масштаба
  if (scaleSmaller) {
    scaleSmaller.addEventListener('click', onScaleDownClick);
  }
  // Добавление обработчика для кнопки увеличения масштаба
  if (scaleBigger) {
    scaleBigger.addEventListener('click', onScaleUpClick);
  }
}

export { initScale, resetScale,};
