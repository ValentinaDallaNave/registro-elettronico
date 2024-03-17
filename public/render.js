import { load_classe } from "./prof.js";
const table_classi = document.getElementById("table_classi");
const table_classe = document.getElementById("table_classe");
const testo = document.getElementById("testo");
const div_salva = document.getElementById("s");

async function render_voti(clas) {
  table_classi.classList.remove("d-block");
  table_classi.classList.add("d-none");
  table_classe.classList.remove("d-none");
  table_classe.classList.add("d-block");
  let lista = await load_classe(clas);
  let classe = lista.classe;
  let materie = lista.materie;
  let voti = lista.voti;
  let template_head = `<th>%materia</th>`;
  let template = `<tr><td>%nome %cognome</td>`;
  let t_voti = `<td><input type="number" id="voto" id_2="mat" min=0 max=10 class="voto form-control" value=%value ></td>`;
  let html = ``;
  materie.forEach((materia) => {
    html += template_head.replace("%materia", materia.materia);
  });
  html += `</tr>`;
  classe.forEach((element) => {
    html += template
      .replace("%nome", element.nome)
      .replace("%cognome", element.cognome);
    let list_voti_stud = voti.filter((voto) => voto.id_stud === element.id);
    materie.forEach((el) => {
      let voto = list_voti_stud.find((v) => v.id_mat === el.id_mat);
      if (voto === undefined) {
        html += t_voti
          .replace("%value", "")
          .replace("voto", element.id)
          .replace("mat", el.id_mat);
      } else {
        html += t_voti
          .replace("%value", voto.voto)
          .replace("voto", voto.id_stud)
          .replace("mat", el.id_mat);
      }
    });
    html += "</tr>";
  });
  table_classe.innerHTML = `<tr><th>Studente</th>` + html;
  div_salva.classList.remove("d-none");
  div_salva.classList.add("d-flex");
}

export function render_classi(classi) {
  div_salva.classList.remove("d-flex");
  div_salva.classList.add("d-none");
  table_classe.classList.remove("d-block");
  table_classe.classList.add("d-none");
  table_classi.classList.remove("d-none");
  const template = `<tr><td>%anno</td>
 <td>%lettera %indirizzo</td><td>
 <button type="button" id="apri" class="apri btn btn-outline-primary" >Apri</button></td></tr>`;
  let html = ``;
  classi.forEach((element) => {
    html += template
      .replace("%anno", element.anno)
      .replace("%lettera", element.lettera)
      .replace("%indirizzo", element.indirizzo)
      .replace("apri", "apri" + element.id_classe);
  });
  table_classi.innerHTML = html;

  let buttons = document.querySelectorAll(".apri");
  buttons.forEach((element) => {
    element.onclick = () => {
      let id = parseInt(element.id.replace("apri", ""));
      let c = "";
      classi.forEach((element) => {
        if (element.id_classe === id) {
          c = element;
        }
      });
      testo.innerHTML = `<h1><b>Classe: ${c.anno} ${c.lettera} ${c.indirizzo}</b></h1>`;
      render_voti(id);
    };
  });
}
