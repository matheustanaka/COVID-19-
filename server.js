const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const http = require("http");
const path = require("path");
const parser = require("body-parser");

const app = express();
const porta = 5501;
const banco = new sqlite3.Database("./dados/usuario.db");

app.use(parser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, ".")));

banco.run(
  "CREATE TABLE IF NOT EXISTS usuario(login TEXT NOT NULL, senha TEXT NOT NULL)"
);

//adiciona arquivo existente no diretório raiz
app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "./register.html"));
});

//adiciona
app.post("/add", (request, response) => {
  banco.serialize(() => {
    banco.run(
      "INSERT INTO usuario(login,senha) VALUES(?,?)",
      [request.body.login, request.body.senha],
      (err) => {
        if (err) {
          response.send("Erro no acesso ao banco de dados");
          return console.log(err.message);
        }
        console.log("Usuario cadastrado");
        response.send("Usuario " + request.body.login + " cadastrado.");
      }
    );
  });
});

app.get("/login", (request, response) => {
  response.sendFile(path.join(__dirname, "./login.html"));
});

app.post("/acesso", (request, response) => {
  var x;
  banco.all(
    "SELECT * FROM usuario WHERE login=? AND senha=?",
    [request.body.login, request.body.senha],
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
      rows.forEach((row) => {
        if (
          row.login === request.body.login &&
          row.senha === request.body.senha
        ) {
          x = 1;
        } else {
          x = 2;
          banco.close();
        }
      });
      if (x === 1) {
        response.send("Ola usuario");
      } else {
        response.send("Cadastrar");
      }
    }
  );
});

//consulta
app.post("/view", (request, response) => {
  banco.serialize(() => {
    banco.each(
      "SELECT * FROM usuario WHERE id=?",
      [request.body.id],
      (err, row) => {
        if (err) {
          response.send("Erro no acesso ao banco de dados");
          return console.log(err.message);
        }
        console.log("Exibindo usuario");
        response.send(`Nome: ${row.nome}, id:${row.id}`);
      }
    );
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
