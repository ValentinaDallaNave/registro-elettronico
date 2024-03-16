//chiamate al server
const login = (tipo, username, password) => {
  return new Promise((res, rej) => {
    fetch("/login/" + tipo, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then((response) => {
      // restituisce true solo se lo stato della risposta è diverso da Unauthorized (401)
      // restituisce false se lo stato è Unauthorized (401)
      res(response.status === 401 ? false : true)});
  });
};

const send = (url, data, credentials) => {
  // Per ogni servizio con metodo Post servono le credenziali admin o prof
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: credentials.username,
        password: credentials.password,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      });
  });
};

const load = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      });
  });
};

export { login, send, load };
