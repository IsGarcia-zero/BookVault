var express = require('express');
const uuid = require('uuid');
var router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
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
function requireAdminLogin(req, res, next) {
  if (req.session && req.session.user && req.session.user.tipo === 'admin') {
    next();
  } else if (req.session && req.session.user) {
    console.log('No hay permisos de administrador');
    res.redirect('/home');
  } else {
    console.log('No hay sesión o no tienes permisos de administrador');
    res.redirect('/');
  }
}

function requireLogout(req, res, next) {
  if (!req.session || !req.session.user) {
    next();
  } else {
    console.log('Ya hay una sesión activa');
    res.redirect('/home');
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/bucket'); // Directorio donde se guardarán los archivos subidos
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // Tamaño máximo del archivo en bytes (en este caso, 5MB)
  },
});
router.get('/',requireLogout, (req, res, next) => {
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
      if (password.length < 8) {

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
router.get('/config', requireAdminLogin, (req, res, next) => {// Es pantalla del administrador
  res.render('indexAdmin', { title: 'Express' });
});
router.post('/subirLibros', upload.fields([{ name: 'pdfFile', maxCount: 1 }, { name: 'imageFile', maxCount: 1 }]), (req, res) => {
  // Obtener los datos del formulario y los archivos subidos
  const { ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion } = req.body;
  const pdfFile = req.files['pdfFile'][0];
  const imageFile = req.files['imageFile'][0];

  // Construir la consulta SQL para insertar el libro en la base de datos
  const insertQuery = `INSERT INTO LIBRO (ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion, pdf_url, img_libro)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [ISBN, nombreAutor, apellidosAutor, edicion, cantidadPaginas, titulo, ciudad, editorial, genero, yearEdicion, pdfFile.filename, imageFile.filename];
  console.log(values);
  // Ejecutar la consulta SQL para insertar el libro en la base de datos
  connection.query(insertQuery, values, (error, results) => {
    if (error) {
      console.error('Error al insertar el libro:', error, values, results);
      // Manejar el error y enviar una respuesta de error al cliente
      return res.status(500).json({ error: 'Error al subir el libro' });
    }

    // El libro se insertó correctamente en la base de datos
    console.log('Libro subido correctamente');
    // Enviar una respuesta exitosa al cliente
    return res.redirect('/config');
  });
});

router.get('/obtenerLibro/:id', requireLogin, (req, res) => {
  const libroId = req.params.id;

  // Construir la consulta SQL para obtener el libro por su ID
  const query = `SELECT * FROM LIBRO WHERE idLibro = ?`;
  connection.query(query, [libroId], (error, results) => {
    if (error) {
      console.error('Error al obtener el libro por ID:', error);
      return res.status(500).json({ error: 'Error al obtener el libro' });
    }

    if (results.length === 0) {
      // El libro no existe, puedes manejarlo de acuerdo a tus necesidades
      return res.status(404).json({ error: 'El libro no existe' });
    }

    const libro = results[0]; // Obtener el primer libro encontrado

    // Enviar los detalles del libro como respuesta
    res.json(libro);
  });
});

router.get('/bandeja', requireLogin, (req, res, next) => {
  res.render('bandejaEntrada', { title: 'Express' });
});
router.get('/busqueda', requireLogin, (req, res, next) => {
  res.render('busquedaNoUsuario', { title: 'Express' });
});
router.get('/favoritos', requireLogin, (req, res, next) => {
  connection.query('SELECT * FROM FAVORITO', (error, results1, fields) => {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log(results1);

      res.render('favoritos', { title: 'Express', results1: results1 });

    }
  });
  //res.render('favoritos', { title: 'Express' });
});
router.get('/lector', requireLogin, (req, res, next) => {
  res.render('lector', { title: 'Express' });
});
router.get('/sugerencias', requireLogin, (req, res, next) => {
  connection.query('SELECT * FROM SUGERENCIA', (error, results1, fields) => {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log(results1);
      res.render('verSugerencias', { title: 'Express', results1: results1 });
    }
  })
});
router.get('/retroalimentacion', requireLogin, (req, res, next) => {
  res.render('retroalimentacionUsuarios', { title: 'Express' });
});
router.get('/solicitud', requireLogin, (req, res, next) => {
  res.render('solicitud_libros', { title: 'Express' });
});
router.post('/enviarRetro', requireLogin, (req, res) => {
  const mensajeRetro = req.body.mensaje;

  // Realiza la inserción en la base de datos
  const sql = 'INSERT INTO RETROALIMENTACION (mensajeRetro) VALUES (?)';
  connection.query(sql, [mensajeRetro], (err, result) => {
    if (err) {
      console.error('Error al realizar la inserción:', err);
      res.sendStatus(500); // Envía una respuesta de error al cliente
    } else {
      console.log('Inserción exitosa');
      res.redirect('/retroalimentacion'); // Envía una respuesta de éxito al cliente
    }
  });
});

router.get('/verretro', (req, res, next) => {
  connection.query('SELECT * FROM RETROALIMENTACION', (error, results1, fields) => {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log(results1);
      res.render('verRetroalimentacion', { title: 'Express', results1: results1 });
    }
  })
});

router.get('/subirLibros', requireAdminLogin, (req, res, next) => {
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

router.get('/gestionar', requireAdminLogin, function (req, res, next) {//Admin
  connection.query('SELECT * FROM LIBRO', (error, results1, fields) => {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log(results1);
      res.render('gestionarLibros', { title: 'Express', results1: results1 });
    }
  })
});
//router.get('/getData', function(req, res, next) {
router.get('/getData', requireLogin, function (req, res, next) {
  let searchQuery = req.query.searchQuery;
  let query = `SELECT titulo, pdf_url FROM LIBRO WHERE titulo LIKE ? LIMIT 3`;
  connection.query(query, [`%${searchQuery}%`], (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(data);
    }
  });
});

router.get('/eliminarlibro/:id', requireAdminLogin, (req, res) => {//Admin
  const id = req.params.id;

  // Aquí ejecuta tu consulta SQL para eliminar el libro con el libroId
  connection.query('DELETE FROM LIBRO WHERE idLibro = ?', [id], (error, results) => {
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
              idUsuario: results[0].idUsuario,
              email: results[0].correo,
              tipo: results[0].tipo,
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
router.post('/favoritos/agregar', requireLogin, (req, res) => {
  const { idArchivo } = req.body;
  const { nombreAutor } = req.body;
  const { titulo } = req.body;
  const { pdf_url } = req.body;
  const { img_libro } = req.body;
  const user = req.session.user.idUsuario;
  console.log(req.body)
  // Verificar si el libro ya está en la lista de favoritos del usuario
  connection.query('SELECT * FROM Favorito WHERE idUsuario = ? AND idFavorito = ?', [user, idArchivo], (error, results, fields) => {
    if (error) {
      console.error('Error al verificar el libro en la lista de favoritos:', error);
      return res.status(500).json({ error: 'Error al agregar el libro a favoritos' });
    }
    if (results.length > 0) {
      // El libro ya está en la lista de favoritos, puedes mostrar un mensaje de error o redirigir a una página de error
      return res.status(400).json({ error: 'El libro ya está en la lista de favoritos' });
    }

    // Agregar el libro a la lista de favoritos del usuario
    connection.query('INSERT INTO Favorito (idFavorito, nombreAutor, tituloLibro, pdf_url, img_libro, idUsuario) VALUES (?, ?, ?, ?, ?, ?)', [idArchivo, nombreAutor, titulo, pdf_url, img_libro, user], (error, results) => {
      if (error) {
        console.error('Error al agregar el libro a favoritos:', error);
        return res.status(500).json({ error: 'Error al agregar el libro a favoritos' });
      }

      // El libro se agregó correctamente a la lista de favoritos
      console.log('Libro agregado a favoritos correctamente');
      return res.status(200).json({ message: 'Libro agregado a favoritos correctamente' });
    });
  });
});
router.delete('/favoritos/:idArchivo', (req, res) => {
  const idArchivo = req.params.idArchivo;

  connection.query('DELETE FROM favorito WHERE idFavorito = ?', [idArchivo], (error, result) => {
    if (error) {
      // Manejar errores de la base de datos
      console.error('Error al eliminar el libro de favoritos:', error);
      return res.status(500).json({ mensaje: 'Error al eliminar el libro de favoritos' });
    }

    // Verificar si se eliminó algún registro de la base de datos
    if (result.affectedRows === 0) {
      // No se encontró ningún libro con el idArchivo especificado, devolver un mensaje de error
      return res.status(404).json({ mensaje: 'El libro no está en la lista de favoritos' });
    }
    res.json({ mensaje: 'Libro eliminado de favoritos correctamente' });
  });
});
router.get('/favoritos/verificar/:idArchivo', (req, res) => {
  const idArchivo = req.params.idArchivo;
  
  // Ejemplo de consulta SQL utilizando el módulo 'mysql'
  const sql = 'SELECT COUNT(*) AS count FROM favorito WHERE idFavorito = ?';
  const values = [idArchivo];

  // Realiza la consulta a la base de datos
  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al verificar el estado del libro favorito en la base de datos:', err);
      res.status(500).json({ error: 'Error al verificar el estado del libro favorito en la base de datos' });
      return;
    }

    const existeFavorito = result[0].count > 0;
    res.json({ existeFavorito });
  });
});
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      throw err;
    }
    res.redirect('/');
  });
});

module.exports = router;
