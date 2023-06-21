var express = require('express');
var router = express.Router();
var connection = require('../model/js/database');
/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('login', { title: 'Express' });
});
router.get('/signup', (req, res, next) =>{
  res.render('signup', { title: 'Express' });
});
router.get('/config', (req, res, next) =>{
  res.render('indexAdmin', { title: 'Express' });
});
router.get('/bandeja', (req, res, next) =>{
  res.render('bandejaEntrada', { title: 'Express' });
});
router.get('/busqueda', (req, res, next) =>{
  res.render('busquedaNoUsuario', { title: 'Express' });
});
router.get('/favoritos', (req, res, next) =>{
  res.render('favoritos', { title: 'Express' });
});
router.get('/lector', (req, res, next) =>{
  res.render('lector', { title: 'Express' });
});
router.get('/retroalimentacion', (req, res, next) =>{
  res.render('retroalimentacionUsuario', { title: 'Express' });
});
router.get('/solicitud', (req, res, next) =>{
  res.render('solicitud_libros', { title: 'Express' });
});

router.get('/subirLibros', (req, res, next) =>{
  res.render('subirLibrosAdmin', { title: 'Express' });
});
router.get('/home', function(req, res, next) {
  connection.query('SELECT * FROM LIBRO',(error, results1, fields)=>{
    if(error){
      console.log(error);
      throw error;
    }else{
      console.log(results1);
      connection.query('SELECT DISTINCT genero FROM LIBRO',(error, results2, fields)=>{
        if(error){
          console.log(error);
          throw error;
        }else{
          connection.query('SELECT COUNT(*) AS cantidad FROM (SELECT DISTINCT genero FROM LIBRO) AS subquery;',(error, results3, fields)=>{
            if(error){
              console.log(error);
              throw error;
            }else{
              console.log(results3);
              res.render('index', { title: 'Express', results1: results1, results2: results2, results3: results3 });
            }
          });
        }
      });
    }
  });
  //res.render('index', { title: 'Express' });
});

router.get('/gestionar', function(req, res, next) {
  connection.query('SELECT * FROM LIBRO',(error, results1, fields)=>{
    if(error){
      console.log(error);
      throw error;
    }else{
      console.log(results1);
      res.render('gestionarLibros', { title: 'Express', results1: results1});
    }  
})
});
router.get('/getData', function(req, res, next) {
  let searchQuery = req.query.searchQuery;
  let query = `SELECT titulo FROM LIBRO WHERE titulo LIKE ? LIMIT 3`;
  connection.query(query, [`%${searchQuery}%`], (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(data);
    }
  });
});
module.exports = router;
