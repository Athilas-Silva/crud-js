const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const mysql = require ("mysql");
const bodyParser = require("body-parser");
const port = 8080;
const multer = require('multer');
let data;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
       cb(null, '//uploads/');
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

// Configurando body-parser para pegar os POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//Resposta após iniciar o servidor
app.listen(port);
console.log('API funcionando!');

// definindo as rotas
 const router = express.Router();
 app.use('/', router);

function execSQLQuery(sqlqry, res) {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'grupo-front',
      port: 3306,
      password: 'Senai115',
      database: 'crudlogin'
    });
    connection.query(sqlqry, function (error, results, fields) {
        if (error)
            res.json(error)
        else
            res.json(results);
        connection.end();
        console.log("Executou!")
    });
}

//------------------------------------------ Cadastro de usuário -------------------------------------------------------//

router.get('/loginuser', (req, res) => {
  execSQLQuery('SELECT * FROM loginuser', res);
})

router.get('/loginuser/:user_id?', (req, res) => {
  let filter = '';
  if(req.params.user_id) filter = ' WHERE user_id=' + parseInt(req.params.user_id);
  execSQLQuery('SELECT * FROM loginuser' + filter, res); 
});

router.delete('/loginuser/:user_id', (req, res) =>{
  execSQLQuery('DELETE FROM loginuser WHERE user_id=' + parseInt(req.params.user_id), res);
});

router.post('/loginuser', upload.single('imagem_user'), (req, res) => {
console.log(req.file);
  const emailLogin = req.body.emailLogin.substring(0,100);
  const nome = req.body.nome.substring(0,100);
  const cargo = req.body.cargo.substring(0,45);
  const salario = req.body.salario.substring(0,50);
  const setor = req.body.setor.substring(0,45);
  const senhaLogin = req.body.senhaLogin.substring(0,45);
  const imagem = 'uploads/' + req.file.filename; 
  execSQLQuery(`INSERT INTO loginuser(emailLogin, nome, cargo, salario, setor, senhaLogin, imagem_user) VALUES('${emailLogin}', '${nome}', '${cargo}', '${salario}', '${setor}', '${senhaLogin}', '${imagem}')`, res);
});

router.patch('/loginuser/:user_id', (req, res) => {
  const user_id = parseInt(req.params.user_id);
  const emailLogin = req.body.emailLogin.substring(0,100);
  const nome = req.body.nome.substring(0,100);
  const cargo = req.body.cargo.substring(0,45);
  const salario = req.body.salario.substring(0,50);
  const setor = req.body.setor.substring(0,45);
  const senhaLogin = req.body.senhaLogin.substring(0,45);
  execSQLQuery(`UPDATE loginuser SET emailLogin='${emailLogin}', nome='${nome}', cargo='${cargo}', salario='${salario}', setor='${setor}', senhaLogin='${senhaLogin}' WHERE user_id=${user_id}`, res);
});