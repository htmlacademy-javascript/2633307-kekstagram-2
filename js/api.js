// Базовый URL API сервиса Kekstagram
const BASE_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';

// Пути (эндпоинты) для разных запросов к API
const Route = {
  GET_DATA: '/data', // получение списка фотографий
  SEND_DATA: '/', // отправка формы с новой фотографией
};

// Поддерживаемые HTTP‑методы
const Method = {
  GET: 'GET',
  POST: 'POST',
};

// Текст сообщений об ошибках для разных типов запросов
const ErrorText = {
  GET_DATA: 'Не удалось загрузить данные. Попробуйте обновить страницу',
  SEND_DATA: 'Не удалось отправить форму. Попробуйте ещё раз',
};

// Универсальная функция загрузки данных: делает запрос и обрабатывает ошибки
const load = async (route, errorText, method = Method.GET, body = null) => {
  try {
    const response = await fetch(`${BASE_URL}${route}`, { method, body });
    if (!response.ok) {
      // если статус не 2xx — бросаем ошибку, чтобы перейти в catch
      throw new Error();
    }
    // при успехе возвращаем распарсенный JSON‑ответ
    return response.json();
  } catch {
    // при любой ошибке пробрасываем человекочитаемый текст
    throw new Error(errorText);
  }
};

// Получение данных с сервера (список фотографий)
const getData = () => load(Route.GET_DATA, ErrorText.GET_DATA);

// Отправка данных формы на сервер (новая фотография)
const sendData = (body) => load(Route.SEND_DATA, ErrorText.SEND_DATA, Method.POST, body);

// Экспорт функций API для использования в других модулях
export { getData, sendData };
