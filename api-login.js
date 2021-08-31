const mysql = require ("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

const app = express();

//Adicionando a estilização da página
app.use("/assets", express.static("assets"))

//Fazendo a conexão com o banco de dados
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'grupo-front',
    port: 3306,
    password: 'Senai115',
    database: 'crudlogin'
  });

  connection.connect(function(error){
    if(error) throw error
    else console.log("Conectado ao banco de dados com sucesso!!")
  });


// Obtendo a resposta da conexão com o Banco de Dados
app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
})

//Autenticando o aplicativo com o banco de dados
app.post("/", encoder,  function(req,res){
  var emailUser = req.body.emailUser;
  var senhaUser = req.body.senhaUser;

  connection.query("SELECT * FROM loginuser WHERE emailLogin = ? AND senhaLogin = ? ",[emailUser, senhaUser], function(error, results, fields){
    if (results.length > 0) {
      res.redirect("/dashboard");
    } else {
      res.redirect("/");
    }
    res.end();
  })
})

//Quando o login for bem sucedido
app.get("/dashboard", function(req, res){
  res.sendFile(__dirname + "/dashboard.html")
})

//Definindo a porta do aplicativo
app.listen(3000);