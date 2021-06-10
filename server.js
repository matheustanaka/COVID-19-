const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const http = require("http");
const path = require("path");
const parser = require("body-parser");
const e = require("express");

const app = express();
const porta = 1501;
const banco = new sqlite3.Database("./newdatabase/usuario.db");

// const router = express.Router();

// router.get("/add", (request, response) => {
//   response.sendFile(path.join(__dirname, "/index.html"));
// });

app.use(parser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./src")));

banco.run(
  "CREATE TABLE IF NOT EXISTS usuario(login TEXT NOT NULL, senha TEXT NOT NULL)"
);

//adiciona arquivo existente no diretório raiz
app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "./src/views/welcome.html"));
});

//adiciona
app.post("/add", (request, response) => {
  banco.serialize(() => {
    banco.run(
      "INSERT INTO usuario(login,senha) VALUES(?,?)",
      [request.body.name, request.body.password],
      (err) => {
        if (err) {
          response.send("Erro no acesso ao banco de dados");
          return console.log(err.message);
        }
        console.log("Usuario cadastrado");
        // response.send("Usuario " + request.body.name + " cadastrado.");
        response.sendFile(path.join(__dirname, "./src/views/index.html"));
      }
    );
  });
});

app.get("/login", (request, response) => {
  response.sendFile(path.join(__dirname, "./src/views/index.html"));
});

app.post("/acesso", (request, response) => {
  var x;
  banco.get(
    "SELECT * FROM usuario WHERE login=? AND senha=?",
    [request.body.name, request.body.password],
    (err, rows) => {
      if (err) {
        next(err);
        return;
      }
      if (!rows) {
        response.status(400);
        response.send("Usuario ou senha invalidos");
        return;
      }
      response.sendFile(path.join(__dirname, "./src/views/index.html"));
    }
  );
});

app.get("/status", (request, response) => {
  response.sendFile(path.join(__dirname, "./src/views/status.html"));
});

//consulta
//Selecionando O ID - no entanto, não estamos criando um ID no banco, somente login e senha
app.post("/view", (request, response) => {
  banco.serialize(() => {
    banco.each(
      "SELECT * FROM usuario WHERE login=? AND senha=?",
      [request.body.name, request.body.password],
      (err, row) => {
        if (err) {
          response.send("Erro no acesso ao banco de dados");
          return console.log(err.message);
        }
        console.log("Exibindo usuario");
        response.send(`Nome: ${row.login}, id:${row.senha}`);
      }
    );
    response.sendFile(path.join(__dirname, "./src/views/index.html"));
  });
});

//fecha o banco
app.get("/close", (request, response) => {
  banco.close((err) => {
    if (err) {
      response.send("Nao foi possivel encerrar a conexao");
      return console.log(err.message);
    }
    console.log("Conexao encerrada");
    response.send("Conexao com banco de dados encerrada");
  });
});

app.listen(porta, () => {
  console.log(`Servidor usando Express rodando na porta ${porta}!`);
});
