//Query varie
//Connessione con database
const fs = require("fs");
const mysql = require("mysql2");
const conf = require("./conf.js");
const connection = mysql.createConnection(conf);

const executeQuery = (sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, function (err, result) {
      if (err) {
        console.error(err);
        reject();
      }
      resolve(result);
    });
  });
};

const createTables = async () => {
  await executeQuery(`
    CREATE TABLE IF NOT EXISTS Classe
    ( id_classe INT PRIMARY KEY AUTO_INCREMENT, 
      anno INT NOT NULL,
      lettera VARCHAR(255) NOT NULL,
      indirizzo VARCHAR(255) NOT NULL )
  `);
  await executeQuery(`
    CREATE TABLE IF NOT EXISTS Studente
    ( id_stud INT PRIMARY KEY AUTO_INCREMENT, 
      nome VARCHAR(255) NOT NULL,
      cognome VARCHAR(255) NOT NULL )

  `);
  await executeQuery(`
    CREATE TABLE IF NOT EXISTS Materia
    ( id_mat INT PRIMARY KEY AUTO_INCREMENT, 
      materia VARCHAR(255) NOT NULL )
  `);
  await executeQuery(`  
    CREATE TABLE IF NOT EXISTS Partecipa
    ( classe INT NOT NULL,
      studente INT NOT NULL,
      PRIMARY KEY (classe,studente),
      FOREIGN KEY (classe) REFERENCES Classe(id_classe),
      FOREIGN KEY (studente) REFERENCES Studente(id_stud) ) 
  `);
  await executeQuery(`  
    CREATE TABLE IF NOT EXISTS Voto
    ( studente INT NOT NULL,
      materia INT NOT NULL,
      voto INT,
      PRIMARY KEY (studente,materia),
      FOREIGN KEY (studente) REFERENCES Studente(id_stud),
      FOREIGN KEY (materia) REFERENCES Materia(id_mat) ) 
  `);
  console.log("Tabelle create");
};

const formatted_values = (values) => {
  let list = "";
  Object.values(values).forEach((e) => {
    if (typeof e === "string") {
      list += "'" + e + "',";
    } else {
      list += e + ",";
    }
  });
  return list.slice(0, -1);
};

const insert = (table, values) => {
  const query = `
   INSERT INTO ${table} (${Object.keys(values).join()})
   VALUES (${formatted_values(values)})
      `;
  console.log(query);
  return executeQuery(query);
};

// select di tutti i record di una tabella
const select = (table, columns) => {
  const query = `
   SELECT ${columns.join()} FROM ${table}
      `;
  console.log(query);
  return executeQuery(query);
};

const get_last_id = async () => {
  return await executeQuery("SELECT LAST_INSERT_ID()")[0]["LAST_INSERT_ID()"];
};

const get_voti_all = async () => {
  return await executeQuery(
    `
    SELECT Studente.id_stud,Materia.id_mat,Voto.voto 
    FROM Studente, Materia, Voto
    WHERE Studente.id_stud = Voto.studente
      AND Voto.materia = Materia.id_stud
    `,
  );
};

const get_voti_class = async (classe) => {
  return await executeQuery(
    `
    SELECT Studente.id_stud,Materia.id_mat,Voto.voto 
    FROM Studente, Materia, Voto, Classe, Partecipa
    WHERE Classe.id_classe = Partecipa.classe
      AND Partecipa.studente = Studente.id_stud
      AND Studente.id_stud = Voto.studente
      AND Voto.materia = Materia.id_stud
      AND Classe.id_classe = '${classe}'
    `,
  );
};

module.exports = {
  executeQuery: executeQuery,
  createTables: createTables,
  get_last_id: get_last_id,
  get_voti_all: get_voti_all,
  get_voti_class: get_voti_class,
  insert: insert,
  select: select,
};
