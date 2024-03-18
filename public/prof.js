import { login, send, load, update } from "./remote.js";
import { render_classi, render_voti } from "./render.js";
const div_login = document.getElementById("div_login");
const div_private = document.getElementById("div_private");
const error_msg = document.getElementById("error_msg");
const username = document.getElementById("username");
const password = document.getElementById("password");
const invia = document.getElementById("invia");
const salva = document.getElementById("salva");
const indietro = document.getElementById("indietro");
let c = "";
let classi = [];
let credentials = {};
let classe = [];
let voti = [];

invia.onclick = async () => {
  // la funzione login restituisce true o false
  if (await login("prof", username.value, password.value)) {
    // le credenziali vengono salvate per i servizi prof
    credentials.username = username.value;
    credentials.password = password.value;
    username.classList.remove("border-danger");
    password.classList.remove("border-danger");
    div_login.classList.remove("d-block");
    div_login.classList.add("d-none");
    div_private.classList.remove("d-none");
    div_private.classList.add("d-block");
    // richiesta delle classi
    let result = await load("/get/data/classi");
    classi = result.result;
    console.log(classi);
    render_classi(classi);
  } else {
    username.classList.add("border-danger");
    password.classList.add("border-danger");
    error_msg.classList.remove("d-none");
    error_msg.classList.add("d-block");
  }
};

export async function load_classe(clas) {
  c = clas;
  let cla = await load("/get/data/" + clas);
  let materie = await load("/get/data/materie");
  let studenti = await load("/get/data/studenti");
  let voti_result = await load("/get/voti/" + clas);
  cla.result.forEach((element) => {
    studenti.result.forEach((stud) => {
      if (element.studente === stud.id_stud) {
        classe.push({
          id: stud.id_stud,
          nome: stud.nome,
          cognome: stud.cognome,
        });
      }
    });
  });
  console.log(classe);
  console.log(materie.result, voti_result.result);
  voti = voti_result.result;
  return { classe: classe, materie: materie.result, voti: voti };
}

salva.onclick = () => {
  let input_voti = document.querySelectorAll(".voto");
  input_voti.forEach((element) => {
    if (element.value !== "") {
      if (element.value <= 10 && element.value >= 0) {
        let id_stud = parseInt(element.id);
        let id_mat = parseInt(element.getAttribute("id_2"));
        let elemento = {
          id_stud: id_stud,
          id_mat: id_mat,
          voto: parseInt(element.value),
        };
        if (
          voti.find(
            (voto) =>
              voto.id_stud === elemento.id_stud &&
              voto.id_mat === elemento.id_mat &&
              voto.voto !== elemento.voto,
          ) !== undefined
        ) {
          update(
            "/prof/update",
            {
              studente: id_stud,
              materia: id_mat,
              voto: parseInt(element.value),
            },
            {
              username: username.value,
              password: password.value,
            },
          ).then((result) => {
            console.log(result);
          });
        } else if (
          voti.find(
            (voto) =>
              voto.id_stud === elemento.id_stud &&
              voto.id_mat === elemento.id_mat &&
              voto.voto === elemento.voto,
          ) === undefined
        ) {
          send(
            "/prof/insert",
            {
              studente: id_stud,
              materia: id_mat,
              voto: parseInt(element.value),
            },
            {
              username: username.value,
              password: password.value,
            },
          ).then((result) => {
            console.log(result);
          });
        }
      }
    }
  });
  console.log(voti);
  classe = [];
  render_voti(c);
};

indietro.onclick = () => {
  classe = [];
  render_classi(classi);
};
