// Модуль фильтрации миниатюр по типу: все, случайные, обсуждаемые
import { renderThumbnails } from './thumbnails.js';
import { debounce } from './util.js';

// Настройки: сколько случайных фото показывать и задержка debounce
const RANDOM_PHOTOS_COUNT = 10;
const DEBOUNCE_DELAY = 500;

// Текущий набор фотографий, полученный с сервера
let currentPhotos = [];

// DOM‑элементы блока фильтров
const filtersContainer = document.querySelector('.img-filters');
const filtersForm = document.querySelector('.img-filters__form');

// Фильтр «по умолчанию» — вернуть все фотографии
const getDefaultPhotos = (photos) => photos.slice();

// Фильтр случайных фотографий (до RANDOM_PHOTOS_COUNT штук, без повторов)
const getRandomPhotos = (photos) => {
  if (photos.length <= RANDOM_PHOTOS_COUNT) {
    return photos.slice();
  }

  const photosCopy = photos.slice();
  const result = [];

  for (let i = 0; i < RANDOM_PHOTOS_COUNT; i++) {
    const randomIndex = Math.floor(Math.random() * photosCopy.length);
    result.push(photosCopy[randomIndex]);
    photosCopy.splice(randomIndex, 1);
  }

  return result;
};

// Фильтр «обсуждаемые» — сортировка по количеству комментариев
const getDiscussedPhotos = (photos) =>
  photos.slice().sort((a, b) => {
    const commentsA = a.comments ? a.comments.length : 0;
    const commentsB = b.comments ? b.comments.length : 0;
    return commentsB - commentsA;
  });

// Словарь доступных фильтров по id кнопки
const filters = {
  'filter-default': getDefaultPhotos,
  'filter-random': getRandomPhotos,
  'filter-discussed': getDiscussedPhotos,
};

// Применение выбранного фильтра и перерисовка миниатюр
const applyFilter = (filterName) => {
  if (!filters[filterName]) {
    return;
  }
  const filteredPhotos = filters[filterName](currentPhotos);
  renderThumbnails(filteredPhotos);
};

// Обработчик кликов по кнопкам фильтров с debounce
const onFilterClick = debounce((evt) => {
  const button = evt.target.closest('.img-filters__button');
  if (!button) {
    return;
  }

  evt.preventDefault();

  const filterName = button.id;
  if (!filterName || !filters[filterName]) {
    return;
  }

  const buttons = filtersForm.querySelectorAll('.img-filters__button');
  buttons.forEach((btn) => {
    btn.classList.remove('img-filters__button--active');
  });
  button.classList.add('img-filters__button--active');

  applyFilter(filterName);
}, DEBOUNCE_DELAY);

// Показ блока фильтров (убирает класс неактивного состояния)
const showFilters = () => {
  if (filtersContainer) {
    filtersContainer.classList.remove('img-filters--inactive');
  }
};

// Инициализация фильтров: сохранение фотографий, подписка на события и установка дефолтного фильтра
export const initFilters = (photos) => {
  if (!photos || photos.length === 0) {
    return;
  }

  currentPhotos = photos;
  showFilters();

  if (filtersForm) {
    filtersForm.addEventListener('click', onFilterClick);

    const defaultButton = document.getElementById('filter-default');
    if (defaultButton) {
      defaultButton.classList.add('img-filters__button--active');
    }
  }
};
