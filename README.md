# registro-elettronico

Credenziali admin:
admin admin

Credenziali prof:
prof prof
mariorossi 1234

Modulo database: select, insert => mysql
Modulo server: post, get, put => express, http
Modulo client_render: tutte le render
Modulo client_comunicazione: send, load, fetch, login
Modulo admin: eventi utente admin
Modulo prof: eventi utente professore
Modulo pubblico: visualizzazione pubblica


Modello logico-relazionale:
Classe(id_classe(PK), anno, lettera, indirizzo)
Studente(id_stud(PK), nome, cognome)
Materia(id_mat(PK), materia)

Partecipa(classe(PK)(FK),studente(PK)(FK))
Voto(studente(PK)(FK),materia(PK)(FK),voto)



Post per l'admin con 3 url:
/admin/materia
{nome:"nome"}

/admin/classe
{anno:5,lettera:"B",indirizzo:"inf"}

/admin/studente
{nome:"nome",cognome:"cognome",classi:[lista id classi]}
nel server si salva lo studente, e la lista delle classe si usa per inserire i "Partecipa"
