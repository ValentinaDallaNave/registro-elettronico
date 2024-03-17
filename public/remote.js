//chiamate al server
const login = async (tipo, username, password) => {
  let response = await fetch("/login/" + tipo, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  // restituisce true solo se lo stato della risposta è diverso da Unauthorized (401)
  // restituisce false se lo stato è Unauthorized (401)
  return response.status === 401 ? false : true;
};

const send = async (url, data, credentials) => {
  // Per ogni servizio con metodo Post servono le credenziali admin o prof
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      username: credentials.username,
      password: credentials.password,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

const load = async (url) => {
  return (await fetch(url)).json();
};

export { login, send, load };
