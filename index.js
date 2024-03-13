const fs = require("fs");
const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");

const db = require("./database.js");
db.createTables(); //crea le tabelle se non esistono

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use("/", express.static(path.join(__dirname, "public")));

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  checkLogin(username, password).then((result) => {
    if (result) {
      res.json(result.json());
    } else {
      res.status(401); //401 è il codice http Unauthorized)
      res.json({ result: "Unauthorized" });
    }
  });
});

app.post("/admin/materia", (req, res) => {
  const data = req.body;
  (async () => {
    await db.insert("Materia", { materia: data.materia });
    res.json({ result: "ok" });
  })();
});

app.post("/admin/classe", (req, res) => {
  const data = req.body;
  (async () => {
    await db.insert("Classe", {
      anno: data.anno,
      lettera: data.lettera,
      indirizzo: data.indirizzo,
    });
    res.json({ result: "ok" });
  })();
});

app.post("/admin/studente", async (req, res) => {
  const data = req.body;
  await db.insert("Studente", {
    nome: data.nome,
    cognome: data.cognome,
  });
  id_stud = await db.get_last_id();
  data.classi.forEach(async (id_classe) => {
    await db.insert("Partecipa", {
      classe: id_classe,
      studente: id_stud,
    });
  });
  res.json({ result: "ok" });
});

app.get("/get/data/:param", async (req, res) => {
  if (req.params.param === "classi") {
    result = await db.select("Classe", "*");
  } else if (req.params.param === "studenti") {
    result = await db.select("Studente", "*");
  } else if (req.params.param === "materie") {
    result = await db.select("Classe", "*");
  }
  res.json({ result: result });
});

app.get("/get/voti/:param", async (req, res) => {
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
