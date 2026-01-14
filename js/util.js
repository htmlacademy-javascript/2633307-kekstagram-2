// Набор вспомогательных утилит: случайные значения, генератор id и debounce
const DEBOUNCE_DELAY = 500;

// Получение случайного целого числа в диапазоне [min, max]
const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

// Получение случайного элемента массива
const getRandomElement = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

// Создание генератора уникальных числовых идентификаторов
const createIdGenerator = () => {
  let lastGeneratedId = 0;

  return () => {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
};

// Генератор id для комментариев
const generateCommentId = createIdGenerator();

// Функция debounce: откладывает вызов колбэка, пока идут частые события
const debounce = (callback, timeoutDelay = DEBOUNCE_DELAY) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

// Экспорт утилит для использования в других модулях
export { getRandomInteger, getRandomElement, generateCommentId, debounce };
