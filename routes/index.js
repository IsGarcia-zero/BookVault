var express = require('express');
const uuid = require('uuid');
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
var connection = require('../model/js/database');

/* GET home page. */
function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    console.log("No hay sesion");
    res.redirect('/');
  }
}
router.get('/', (req, res, next) => {
  res.render('login', { title: 'Express' });
  
});
router.get('/signup', (req, res, next) => {
  res.render('signup', { title: 'Express' });
});
router.post('/signup', (req, res) => {
  const { nombres, email, password, EDAD } = req.body;
  const tipo = "usuario";
  const idUsuario = uuid.v4();
  const emailRegex = /^[A-Za-z0-9._%+-]+@(alumno\.ipn\.mx|ipn\.mx)$/;
  // Verificar si el usuario ya existe en la base de datos
  connection.query('SELECT * FROM usuarios WHERE correo = ?', [email], (error, results, fields) => {
    if (error) {
      console.log(error);
      throw error;
    }
    if (results.length > 0) {
      // El usuario ya existe, puedes mostrar un mensaje de error o redirigir a una página de error
    
      return res.render('signup', { title: 'Signup', error: 'El usuario ya existe' });
    } else {
      // El usuario no existe, podemos continuar con el registro
      // Generar el hash de la contraseña
      if (EDAD < 18) {
        return res.render('signup', { title: 'Signup', error: 'No puedes registrarte, eres menor de edad' });
      }
      if(password.length < 8){
        
        return res.render('signup', { title: 'Signup', error: 'La contraseña debe tener al menos 8 caracteres' });
      }
      if (!emailRegex.test(email)) {
        
        return res.render('signup', { title: 'Signup', error: 'El correo no es valido' });
      }
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {

          console.log(err);
          throw err;
        }
        // Guardar el usuario en la base de datos con la contraseña hasheada
        connection.query('INSERT INTO usuarios (idUsuario, nombre, correo, contrasena, EDAD, tipo) VALUES (?, ? ,?, ?, ?, ?)', [idUsuario, nombres, email, hash, EDAD, tipo], (err, results, fields) => {
          if (err) {
            console.log(err);
            throw err;
          }

          // Redirigir a la página de inicio de sesión después del registro exitoso
          res.redirect('/');
        });
      });
    }
  });
});
router.get('/config', requireLogin, (req, res, next) => {
  res.render('indexAdmin', { title: 'Express' });
});
router.get('/bandeja', requireLogin, (req, res, next) => {
  res.render('bandejaEntrada', { title: 'Express' });
});
router.get('/busqueda', requireLogin, (req, res, next) => {
  res.render('busquedaNoUsuario', { title: 'Express' });
});
router.get('/favoritos', requireLogin, (req, res, next) => {
  res.render('favoritos', { title: 'Express' });
});
router.get('/lector', requireLogin, (req, res, next) => {
  res.render('lector', { title: 'Express' });
});
router.get('/retroalimentacion', requireLogin, (req, res, next) => {
  res.render('retroalimentacionUsuario', { title: 'Express' });
});
router.get('/solicitud', requireLogin, (req, res, next) => {
  res.render('solicitud_libros', { title: 'Express' });
});

router.get('/subirLibros', requireLogin, (req, res, next) => {
  res.render('subirLibrosAdmin', { title: 'Express' });
});
router.get('/home', requireLogin, function (req, res, next) {
  connection.query('SELECT * FROM LIBRO', (error, results1, fields) => {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log(results1);
      connection.query('SELECT DISTINCT genero FROM LIBRO', (error, results2, fields) => {
        if (error) {
          console.log(error);
          throw error;
        } else {
          connection.query('SELECT COUNT(*) AS cantidad FROM (SELECT DISTINCT genero FROM LIBRO) AS subquery;', (error, results3, fields) => {
            if (error) {
              console.log(error);
              throw error;
            } else {
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
//router.get('/getData', function(req, res, next) {
router.get('/getData', requireLogin, function (req, res, next) {
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
router.get('/eliminarlibro/:id', (req, res) => {
  const id = req.params.id;

  // Aquí ejecuta tu consulta SQL para eliminar el libro con el libroId
  connection.query('DELETE FROM LIBRO WHERE idLibro = ?', [id], (error,results) => {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log('Libro eliminado correctamente');
      res.redirect('/gestionar'); // Redirecciona al usuario a la página de gestión después de eliminar el libro
    }
  })
});
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  connection.query('SELECT * FROM USUARIOS WHERE correo = ?', [email], (error, results, fields) => {
    if (error) {
      console.log(error);
      throw error;
    } else {
      if (results.length > 0) {
        const storedPassword = results[0].contrasena;
        bcrypt.compare(password, storedPassword, (err, isMatch) => {
          if (err) {
            console.log(err);
            throw err;
          }

          if (isMatch) {
            req.session.user = {
              email: results[0].correo,
              tipo: results[0].tipo
            };

            if (results[0].tipo === "admin") {
              return res.redirect('/config');
            } else {
              return res.redirect('/home');
            }
          } else {
            return res.redirect('/');
          }
        });
      } else {
        return res.redirect('/');
      }
    }
  });
});
module.exports = router;
