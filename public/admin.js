import { login, send, load } from "./remote.js";
import {
  render_tags_classi_stud,
  render_in_classe_stud,
} from "./admin_render.js";

const btn_login = document.getElementById("btn_login");
const in_pass = document.getElementById("in_pass");
const in_user = document.getElementById("in_user");

const form_mat = document.getElementById("form_mat");
const in_nome_mat = document.getElementById("in_nome_mat");
const ins_mat = document.getElementById("ins_mat");
const ins_mat_fdbck = document.getElementById("ins_mat_fdbck");

const form_classe = document.getElementById("form_classe");
const in_anno_classe = document.getElementById("in_anno_classe");
const in_lett_classe = document.getElementById("in_lett_classe");
const in_ind_classe = document.getElementById("in_ind_classe");
const ins_classe = document.getElementById("ins_classe");
const ins_classe_fdbck = document.getElementById("ins_classe_fdbck");

const form_stud = document.getElementById("form_stud");
const in_nome_stud = document.getElementById("in_nome_stud");
const in_cogn_stud = document.getElementById("in_cogn_stud");
const in_classe_stud = document.getElementById("in_classe_stud");
const ins_stud = document.getElementById("ins_stud");
const ins_stud_fdbck = document.getElementById("ins_stud_fdbck");

const tags_classi_stud = document.getElementById("tags_classi_stud");

let classi_stud = [];
let classi = [];
let credentials = {};

const div_login = document.getElementById("div_login");
const div_private = document.getElementById("div_private");

btn_login.onclick = async () => {
  // la funzione login restituisce true o false
  if (await login("admin", in_user.value, in_pass.value)) {
    // le credenziali vengono salvate per i servizi admin
    credentials.username = in_user.value;
    credentials.password = in_pass.value;
    div_login.classList.remove("d-block");
    div_login.classList.add("d-none");
    div_private.classList.remove("d-none");
    div_private.classList.add("d-block");
    // richiesta delle classi per l'input dello studente
    classi = (await load("/get/data/classi")).result;
    // render delle classi disponibili
    render_in_classe_stud(classi);
  }
};

ins_mat.onclick = async () => {
  // salvataggio della materia
  if (in_nome_mat.value) {
    await send("/admin/materia", { materia: in_nome_mat.value }, credentials);
    ins_mat_fdbck.innerText = "Materia inserita";
    form_mat.reset();
  } else {
    ins_mat_fdbck.innerText = "";
  }
};

ins_classe.onclick = async () => {
  // salvataggio della classe
  if (in_anno_classe.value && in_lett_classe.value && in_ind_classe.value) {
    await send(
      "/admin/classe",
      {
        anno: in_anno_classe.value,
        lettera: in_lett_classe.value,
        indirizzo: in_ind_classe.value,
      },
      credentials,
    );
    ins_classe_fdbck.innerText = "Classe inserita";
    form_classe.reset();
  } else {
    ins_classe_fdbck.innerText = "";
  }
};

ins_stud.onclick = async () => {
  // salvataggio dello studente
  if (in_nome_stud.value && in_cogn_stud.value && classi_stud) {
    console.log({
      nome: in_nome_stud.value,
      cognome: in_cogn_stud.value,
      classi: classi_stud,
    });
    await send(
      "/admin/studente",
      {
        nome: in_nome_stud.value,
        cognome: in_cogn_stud.value,
        classi: classi_stud,
      },
      credentials,
    );
    ins_stud_fdbck.innerText = "Studente inserito";
    form_stud.reset();
    in_classe_stud.value = "";
    classi_stud = [];
    tags_classi_stud.innerHTML = "";
  } else {
    ins_stud_fdbck.innerText = "";
    classi_stud = [];
    tags_classi_stud.innerHTML = "";
  }
};

in_classe_stud.onchange = () => {
  // selezionando una classe, viene aggiunta alla lista delle classi dello studente
  if (!classi_stud.includes(parseInt(in_classe_stud.value))) {
    classi_stud.push(parseInt(in_classe_stud.value));
    // render delle classi selezionate
    render_tags_classi_stud(classi_stud, classi);
  }
  in_classe_stud.value = "";
};
