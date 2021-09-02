const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const mysql = require ("mysql");
const bodyParser = require("body-parser");
const port = 8080;

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
      user: 'root',
      port: 3306,
      password: '',
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

router.get('/loginuser/:idUser?', (req, res) => {
  let filter = '';
  if(req.params.idUser) filter = ' WHERE idUser=' + parseInt(req.params.idUser);
  execSQLQuery('SELECT * FROM loginuser' + filter, res); 
});

router.delete('/loginuser/:idUser', (req, res) =>{
  execSQLQuery('DELETE FROM loginuser WHERE idUser=' + parseInt(req.params.idUser), res);
});

router.post('/loginuser', (req, res) => {
  const emailUser = req.body.emailUser.substring(0,100);
  const nome = req.body.nome.substring(0,100);
  const cargo = req.body.cargo.substring(0,45);
  const salario = req.body.salario.substring(0,50);
  const setor = req.body.setor.substring(0,45);
  const senhaUser = req.body.senhaUser.substring(0,45);  
  execSQLQuery(`INSERT INTO loginuser(emailUser, nome, cargo, salario, setor, senhaUser) VALUES('${emailUser}', '${nome}', '${cargo}', '${salario}', '${setor}', '${senhaUser}')`, res);
});

router.patch('/loginuser/:idUser', (req, res) => {
  const idUser = parseInt(req.params.idUser);
  const emailUser = req.body.emailUser.substring(0,100);
  const nome = req.body.nome.substring(0,100);
  const cargo = req.body.cargo.substring(0,45);
  const salario = req.body.salario.substring(0,50);
  const setor = req.body.setor.substring(0,45);
  const senhaUser = req.body.senhaUser.substring(0,45);
  execSQLQuery(`UPDATE loginuser SET emailUser='${emailUser}', nome='${nome}', cargo='${cargo}', salario='${salario}', setor='${setor}', senhaUser='${senhaUser}' WHERE idUser='${idUser}'`, res);
});