// Модуль управления масштабом (увеличение/уменьшение) превью изображения
const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const scaleValue = document.querySelector('.scale__control--value');
const imagePreview = document.querySelector('.img-upload__preview img');

// Константы шага и допустимого диапазона масштабирования
const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

// Текущее значение масштаба
let currentScale = SCALE_DEFAULT;

// Обновление значения масштаба и CSS‑трансформации изображения
function updateScale(value) {
  currentScale = Math.max(SCALE_MIN, Math.min(SCALE_MAX, value));
  scaleValue.value = `${currentScale}%`;

  if (imagePreview) {
    imagePreview.style.transform = `scale(${currentScale / 100})`;
  }
}
// Обработчик клика по кнопке уменьшения масштаба
function onScaleDownClick() {
  updateScale(currentScale - SCALE_STEP);
}

// Обработчик клика по кнопке увеличения масштаба
function onScaleUpClick() {
  updateScale(currentScale + SCALE_STEP);
}

// Сброс масштаба к значению по умолчанию
function resetScale() {
  currentScale = SCALE_DEFAULT;
  updateScale(SCALE_DEFAULT);
}

// Инициализация управления масштабом: установка начального значения и обработчиков событий
function initScale() {
  resetScale();
  if (scaleSmaller) {
    scaleSmaller.addEventListener('click', onScaleDownClick);
  }
  if (scaleBigger) {
    scaleBigger.addEventListener('click', onScaleUpClick);
  }
}

export { initScale, resetScale,};
