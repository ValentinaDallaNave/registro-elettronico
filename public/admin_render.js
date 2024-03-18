const tags_classi_stud = document.getElementById("tags_classi_stud");
const in_classe_stud = document.getElementById("in_classe_stud");
const ul_materie = document.getElementById("materie");
const ul_classi = document.getElementById("classi");
const ul_studenti = document.getElementById("studenti");

const render_ul = (name, list) => {
  let html = `<li
      class="list-group-item list-group-item-secondary text-center"
    >
      <h4>${name.charAt(0).toUpperCase() + name.slice(1)}<h4>
    </li>`;
  document.getElementById(name).innerHTML = "";
  list.forEach((e) => {
    let string = "";
    if (name === "materie") {
      string = e.materia;
    } else if (name === "classi") {
      string = `${e.anno} ${e.lettera} ${e.indirizzo}`;
    } else {
      string = `${e.nome} ${e.cognome}`;
    }
    html += `<li class="list-group-item">${string}</li>`;
  });
  document.getElementById(name).innerHTML = html;
};

const render_tags_classi_stud = (classi_stud, classi) => {
  // render delle classi selezionate per lo studente
  let html = "";
  tags_classi_stud.innerHTML = "";
  classi_stud.forEach((id) => {
    let classe = classi.find((classe) => classe.id_classe === id);

    html += `<button id="${classe.id_classe}" type="button" class="tag-btn m-1 btn btn-secondary">
                  <div>${classe.anno} ${classe.lettera} ${classe.indirizzo} 🞨</div>
              </button>`;
  });
  tags_classi_stud.innerHTML = html;
  bind(classi_stud, classi);
};

const bind = (classi_stud, classi) => {
  // binding del tag della classe per rimuoverla
  let tags = document.querySelectorAll(".tag-btn");
  tags.forEach((tag) => {
    tag.onclick = () => {
      let index = classi_stud.indexOf(parseInt(tag.id));
      classi_stud.splice(index, 1);
      render_tags_classi_stud(classi_stud, classi);
    };
  });
};

const render_in_classe_stud = (classi) => {
  // render delle classi disponibili
  let html = "";
  in_classe_stud.innerHTML = "";
  classi.forEach((classe) => {
    html += `<option value=${classe.id_classe}>${classe.anno} ${classe.lettera} ${classe.indirizzo}</option>`;
  });
  in_classe_stud.innerHTML = html;
  in_classe_stud.value = "";
};

export { render_ul, render_tags_classi_stud, render_in_classe_stud, bind };
