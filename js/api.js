// api.js
export async function getData(){
  return fetch('https://31.javascript.htmlacademy.pro/kekstagram/data')
    .then((r) => r.json());
}

export async function sendData(body){
  return fetch(' https://31.javascript.htmlacademy.pro/kekstagram', {
    method: 'POST',
    body: body
  });
}
