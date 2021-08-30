const mysql = require ("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

const app = express();

const multer = require('multer');
let data;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
       cb(null, './uploads/');
    // cb(null, '/nodemsql/uploads/');
  },
  filename: function(req, file, cb) {
    data = new Date().toISOString().replace(/:/g, '-') + '-';
     cb(null, data + file.originalname);  
        
    }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
    fileFilter: fileFilter
});

//Adicionando a estilização da página
app.use("/assets", express.static("assets"))

//Fazendo a conexão com o banco de dados
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
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
      res.redirect("/welcome");
    } else {
      res.redirect("/");
    }
    res.end();
  })
})

//Quando o login for bem sucedido
app.get("/welcome", function(req, res){
  res.sendFile(__dirname + "/welcome.html")
})

app.get('/loginuser', (req, res) => {
  connection.query('SELECT * FROM loginuser', res);
})

app.get('/loginuser/:user_id?', (req, res) => {
let filter = '';
if(req.params.user_id) filter = ' WHERE user_id=' + parseInt(req.params.user_id);
  connection.query('SELECT * FROM loginuser' + filter, res); 
});

app.delete('/loginuser/:user_id', (req, res) =>{
  connection.query('DELETE FROM loginuser WHERE user_id=' + parseInt(req.params.user_id), res);
});

app.post('/loginuser', upload.single('imagem_user'), (req, res) => {
  console.log(req.file);
  const emailLogin = req.body.emailLogin
  const nome = req.body.nome
  const cargo = req.body.cargo
  const salario = req.body.salario
  const setor = req.body.setor
  const senhaLogin = req.body.senhaLogin
  const imagem = 'uploads/' + req.file.filename;
  connection.query('INSERT INTO loginuser SET ?' ({emailLogin:emailLogin, nome:nome, cargo:cargo, salario:salario, setor:setor, senhaLogin:senhaLogin, imagem:imagem}), res);
});

app.patch('/loginuser/:user_id', (req, res) => {
  const user_id = parseInt(req.params.user_id);
  const emailLogin = req.body.emailLogin;
  const nome = req.body.nome;
  const cargo = req.body.cargo;
  const salario = req.body.salario;
  const setor = req.body.setor;
  const senhaLogin = req.body.senhaLogin;
  execSQLQuery(`UPDATE loginuser SET emailLogin='${emailLogin}', nome='${nome}', cargo='${cargo}', salario='${salario}', setor='${setor}', senhaLogin='${senhaLogin}' WHERE user_id=${user_id}`, res);
});

//Definindo a porta do aplicativo
app.listen(3000);