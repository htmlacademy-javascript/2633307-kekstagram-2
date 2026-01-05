const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const scaleValue = document.querySelector('.scale__control--value');

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

let currentScale = SCALE_DEFAULT;

function updateScale(value) {
  currentScale = Math.max(SCALE_MIN, Math.min(SCALE_MAX, value));
  scaleValue.value = `${currentScale}%`;

  // Без применения к изображению, так как его пока нет
}

function resetScale() {
  currentScale = SCALE_DEFAULT;
  updateScale(SCALE_DEFAULT);
}

function getCurrentScale() {
  return currentScale;
}

function initScale() {
  resetScale();

  if (scaleSmaller) {
    scaleSmaller.addEventListener('click', () => {
      updateScale(currentScale - SCALE_STEP);
    });
  }

  if (scaleBigger) {
    scaleBigger.addEventListener('click', () => {
      updateScale(currentScale + SCALE_STEP);
    });
  }
}

export { initScale, resetScale, getCurrentScale };
