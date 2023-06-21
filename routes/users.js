var express = require('express');
var router = express.Router();
function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    console.log("No hay sesion");
    res.redirect('/');
  }
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/home',requireLogin, function(req, res, next) {
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
module.exports = router;
