const fs = require("fs");
const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");

const db = require("./database.js");
const { resolve } = require("dns");
db.createTables(); //crea le tabelle se non esistono
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use("/", express.static(path.join(__dirname, "public")));

app.post("/login/:param", (req, res) => {
  // login per entrare nella pagina
  const username = req.body.username;
  const password = req.body.password;
  db.checkLogin(req.params.param, username, password).then((result) => {
    if (result) {
      res.json({ result: "ok" });
    } else {
      res.status(401); //401 è il codice http Unauthorized)
      res.json({ result: "Unauthorized" });
    }
  });
});

app.post("/admin/materia", async (req, res) => {
  // check del login admin
  result = await db.checkLogin(
    "admin",
    req.headers.username,
    req.headers.password,
  );
  if (result) {
    const data = req.body;
    // inserimento materia
    await db.insert("Materia", { materia: data.materia });
    res.json({ result: "ok" });
  } else {
    res.status(401); //401 è il codice http Unauthorized)
    res.json({ result: "Unauthorized" });
  }
});

app.post("/admin/classe", async (req, res) => {
  // check del login admin
  result = await db.checkLogin(
    "admin",
    req.headers.username,
    req.headers.password,
  );
  if (result) {
    const data = req.body;
    // inserimento classe
    await db.insert("Classe", {
      anno: data.anno,
      lettera: data.lettera,
      indirizzo: data.indirizzo,
    });
    res.json({ result: "ok" });
  } else {
    res.status(401); //401 è il codice http Unauthorized)
    res.json({ result: "Unauthorized" });
  }
});

app.post("/admin/studente", async (req, res) => {
  // check del login admin
  result = await db.checkLogin(
    "admin",
    req.headers.username,
    req.headers.password,
  );
  if (result) {
    const data = req.body;
    // inserimento studente
    await db.insert("Studente", {
      nome: data.nome,
      cognome: data.cognome,
    });
    id_stud = await db.get_last_id(); // id dello studente appena salvato
    // inserimento in tabella Partecipa
    data.classi.forEach(async (id_classe) => {
      await db.insert("Partecipa", {
        classe: id_classe,
        studente: id_stud,
      });
    });
    res.json({ result: "ok" });
  } else {
    res.status(401); //401 è il codice http Unauthorized)
    res.json({ result: "Unauthorized" });
  }
});

app.post("/prof/insert", async (req, res) => {
  result = await db.checkLogin(
    "prof",
    req.headers.username,
    req.headers.password,
  );
  if (result) {
    await db.insert("Voto", req.body);
    res.json({ result: "ok" });
  } else {
    res.status(401); //401 è il codice http Unauthorized)
    res.json({ result: "Unauthorized" });
  }
});

app.put("/prof/update", async (req, res) => {
  result = await db.checkLogin(
    "prof",
    req.headers.username,
    req.headers.password,
  );
  if (result) {
    await db.update_voto(req.body.id_stud, req.body.id_mat, req.body.voto);
    res.json({ result: "ok" });
  } else {
    res.status(401); //401 è il codice http Unauthorized)
    res.json({ result: "Unauthorized" });
  }
});

app.get("/get/data/:param", async (req, res) => {
  //non richiede login perchè i dati sono pubblici
  if (req.params.param === "classi") {
    result = await db.select("Classe", ["*"]);
  } else if (req.params.param === "studenti") {
    result = await db.select("Studente", ["*"]);
  } else if (req.params.param === "materie") {
    result = await db.select("Materia", ["*"]);
  } else {
    result = await db.get_classe(req.params.param);
  }
  res.json({ result: result });
});

app.get("/get/voti/:param", async (req, res) => {
  //non richiede login perchè i dati sono pubblici
  if (req.params.param === "all") {
    voti = await db.get_voti_all();
  } else {
    voti = await db.get_voti_class(req.params.param);
  }
  res.json({ result: voti });
});

//http
const server = http.createServer(app);
server.listen(80, () => {
  console.log("- server running");
});
