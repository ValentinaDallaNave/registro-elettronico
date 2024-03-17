import { login, send, load } from "./remote.js";
const div_login = document.getElementById("div_login");
const div_private = document.getElementById("div_private");
const username = document.getElementById("username");
const password = document.getElementById("password");
const invia = document.getElementById("invia");
const table_classi = document.getElementById("table_classi");

let classi = [];
let credentials = {};

invia.onclick = async () => {
  // la funzione login restituisce true o false
  if (await login("prof", username.value, password.value)) {
    // le credenziali vengono salvate per i servizi prof
    credentials.username = username.value;
    credentials.password = password.value;
    div_login.classList.remove("d-block");
    div_login.classList.add("d-none");
    div_private.classList.remove("d-none");
    div_private.classList.add("d-block");
    // richiesta delle classi
    result = await load("/get/data/classi");
    classi = result.result;
    console.log(classi);
  }
};
