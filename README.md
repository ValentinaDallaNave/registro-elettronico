# registro-elettronico

Modulo database: select, insert, update =>mysql
Modulo server: post, get, put =>express, http
Modulo client_render: tutte le render
Modulo client_comunicazione: send, load, fetch, login
Modulo admin: eventi utente admin
Modulo prof: eventi utente professore
Modulo pubblico: visualizzazione pubblica

Struttura dell'array che l'admin invia al server: 

Modello logico-relazionale:
Classe(id(PK), anno, lettera, indirizzo)
Studente(id(PK), nome, cognome)
Materia(id(PK), nome)

FaParte(classe(PK)(FK),studente(PK)(FK))
Contiene(classe(PK)(FK),materia(PK)(FK))
Voto(studente(PK)(FK),classe(PK)(FK),materia(PK)(FK))

ma si aggiungono tutti insieme, o uno per volta?
l'admin crea la classe e la invia, una classe alla volta, lo stesso vale per le materie ecc non si può modificare niente, c'è scritto solo aggiungere
Si possono modificare le materie,classi e studenti?okoko



Post con 3 url:
/admin/materia
{nome:"nome"}

/admin/classe
{anno:5,lettera:"B",indirizzo:"inf",materie:[lista degli id delle materie]}
*quindi devi prima inserire le materie

nel server si salva la classe nel database, e la lista delle materie si usa per creare i "Contiene"
ce prima insert della Classe, poi prendi l'id di questo, e fai insert di 

/admin/studente
{nome:"nome",cognome:"cognome",classi:[lista id classi]}
*quindi devi inserire prima sia le classe che le materie

nel server si salva lo studente, e la lista delle classe si usa per creare i "FaParte"
ce prima insert dello Studente, poi prendi l'id di questo studente, e fai insert di FaParte