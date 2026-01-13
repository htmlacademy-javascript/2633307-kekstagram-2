import { renderThumbnails, } from './thumbnails.js';
import { debounce } from './util.js';

const RANDOM_PHOTOS_COUNT = 10;
const DEBOUNCE_DELAY = 500;

// Состояние
let currentPhotos = [];

// DOM элементы
const filtersContainer = document.querySelector('.img-filters');
const filtersForm = document.querySelector('.img-filters__form');

// Функции фильтрации
const getDefaultPhotos = (photos) => photos.slice();

const getRandomPhotos = (photos) => {
  // Если фотографий меньше 10, возвращаем все
  if (photos.length <= RANDOM_PHOTOS_COUNT) {
    return photos.slice();
  }

  // Создаем копию массива
  const photosCopy = photos.slice();
  const result = [];

  // Выбираем 10 случайных неповторяющихся фотографий
  for (let i = 0; i < RANDOM_PHOTOS_COUNT; i++) {
    const randomIndex = Math.floor(Math.random() * photosCopy.length);
    result.push(photosCopy[randomIndex]);
    photosCopy.splice(randomIndex, 1);
  }

  return result;
};

const getDiscussedPhotos = (photos) =>
  photos.slice().sort((a, b) => {
    const commentsA = a.comments ? a.comments.length : 0;
    const commentsB = b.comments ? b.comments.length : 0;
    return commentsB - commentsA;
  });

// Карта фильтров
const filters = {
  'default': getDefaultPhotos,
  'random': getRandomPhotos,
  'discussed': getDiscussedPhotos
};

// Применение фильтра с рендерингом
const applyFilter = (filterName) => {
  if (!filters[filterName]) {
    // eslint-disable-next-line no-console
    console.error(`Фильтр ${filterName} не найден`);
    return;
  }


  // Получаем отфильтрованные фотографии
  const filteredPhotos = filters[filterName](currentPhotos);
  // eslint-disable-next-line no-console


  // Рендерим новые миниатюры
  renderThumbnails(filteredPhotos);
};

// Получаем имя фильтра из id кнопки
const getFilterNameFromId = (id) => {
  if (!id) {
    return null;
  }

  // Проверяем разные варианты id
  if (id === 'filter-default' || id.includes('default')) {
    return 'default';
  }
  if (id === 'filter-random' || id.includes('random')) {
    return 'random';
  }
  if (id === 'filter-discussed' || id.includes('discussed')) {
    return 'discussed';
  }

  return null;
};

// Обработчик клика с debounce
const onFilterClick = debounce((evt) => {
  const button = evt.target.closest('.img-filters__button');
  if (!button) {
    return;
  }

  evt.preventDefault();

  // Получаем имя фильтра из id кнопки
  const filterName = getFilterNameFromId(button.id);
  // eslint-disable-next-line no-console


  if (!filterName) {
    // eslint-disable-next-line no-console
    console.error('Не удалось определить фильтр для кнопки. ID:', button.id);
    return;
  }

  // Обновляем активную кнопку
  const buttons = filtersForm.querySelectorAll('.img-filters__button');
  buttons.forEach((btn) => {
    btn.classList.remove('img-filters__button--active');
  });
  button.classList.add('img-filters__button--active');

  // Применяем фильтр
  applyFilter(filterName);
}, DEBOUNCE_DELAY);

// Показ блока фильтров
const showFilters = () => {
  if (filtersContainer) {
    // Убираем скрывающий класс
    filtersContainer.classList.remove('img-filters--inactive');
  }
};

// Инициализация фильтров
export const initFilters = (photos) => {
  if (!photos || photos.length === 0) {
    // eslint-disable-next-line no-console
    console.error('Нет фотографий для фильтрации');
    return;
  }

  // eslint-disable-next-line no-console

  currentPhotos = photos;

  // Показываем блок фильтров
  showFilters();

  // Добавляем обработчики
  if (filtersForm) {
    // Находим все кнопки
    const buttons = filtersForm.querySelectorAll('.img-filters__button');

    // Если у кнопок нет id, присваиваем им
    if (buttons.length >= 3) {
      if (!buttons[0].id) {
        buttons[0].id = 'filter-default';
      }
      if (!buttons[1].id) {
        buttons[1].id = 'filter-random';
      }
      if (!buttons[2].id) {
        buttons[2].id = 'filter-discussed';
      }
    }

    filtersForm.addEventListener('click', onFilterClick);

    // Устанавливаем активную кнопку "По умолчанию"
    const defaultButton = document.getElementById('filter-default');
    if (defaultButton) {
      defaultButton.classList.add('img-filters__button--active');
    } else if (buttons[0]) {
      // Если нет id, но есть первая кнопка
      buttons[0].classList.add('img-filters__button--active');
    }
  }

  // Первоначальная отрисовка
  applyFilter('default');
};

// Сброс фильтров
export const resetFilters = () => {
  if (filtersForm) {
    filtersForm.removeEventListener('click', onFilterClick);
  }

  // Сбрасываем активную кнопку
  const buttons = filtersForm.querySelectorAll('.img-filters__button');
  buttons.forEach((btn) => {
    btn.classList.remove('img-filters__button--active');
  });

  // Устанавливаем кнопку "по умолчанию" как активную
  const defaultButton = document.getElementById('filter-default');
  if (defaultButton) {
    defaultButton.classList.add('img-filters__button--active');
  } else if (buttons[0]) {
    buttons[0].classList.add('img-filters__button--active');
  }

  // clearThumbnails();
  currentPhotos = [];
};
