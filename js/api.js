// Апи для получения и отправки данныхexport async function sendData(body) {
export async function getData() {
  try {
    const response = await fetch('https://31.javascript.htmlacademy.pro/kekstagram/data');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка при получении данных:', error);
    throw error;
  }
}

export async function sendData(body) {
  try {
    // Проверяем, что body является FormData
    if (!(body instanceof FormData)) {
      throw new Error('Тело запроса должно быть FormData');
    }

    // Для отладки: выводим содержимое FormData


    for (const [key, value] of body.entries()) {
      // eslint-disable-next-line no-console
      console.log(`${key}:`, value);
    }

    const response = await fetch('https://31.javascript.htmlacademy.pro/kekstagram', {
      method: 'POST',
      body: body,

    });


    if (!response.ok) {
      // Получаем текст ошибки от сервера для отладки
      const errorText = await response.text();
      // eslint-disable-next-line no-console
      console.error('Текст ошибки от сервера:', errorText);

      throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
    }

    // Проверяем тип содержимого ответа
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Подробная ошибка при отправке:');
    // eslint-disable-next-line no-console
    console.error('- Сообщение:', error.message);
    // eslint-disable-next-line no-console
    console.error('- Тип:', error.name);

    // Проверяем CORS ошибки
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      // eslint-disable-next-line no-console
      console.error('Возможно CORS ошибка. Проверьте настройки сервера.');
    }

    throw error;
  }
}
