// api.js
const ServerConfig = {
  BASE_URL: 'https://31.javascript.htmlacademy.pro/kekstagram',
  Routes: {
    DATA: '/data',
    UPLOAD: '/'
  },
  Timeouts: {
    GET: 10000,
    POST: 30000
  }
};

// Функция для создания запроса с таймаутом
const createFetchWithTimeout = (url, options = {}, timeout = 10000) => Promise.race([
  fetch(url, options),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Таймаут запроса')), timeout)
  )
]);

// Получение данных с сервера
const getData = async () => {
  const url = `${ServerConfig.BASE_URL}${ServerConfig.Routes.DATA}`;

  try {
    const response = await createFetchWithTimeout(
      url,
      { method: 'GET' },
      ServerConfig.Timeouts.GET
    );

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Не удалось загрузить фотографии: ${error.message}`);
  }
};

// Отправка данных на сервер
const sendData = async (formData) => {
  const url = `${ServerConfig.BASE_URL}${ServerConfig.Routes.UPLOAD}`;

  try {
    const response = await createFetchWithTimeout(
      url,
      {
        method: 'POST',
        body: formData
      },
      ServerConfig.Timeouts.POST
    );

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Не удалось отправить форму: ${error.message}`);
  }
};

export { getData, sendData};
