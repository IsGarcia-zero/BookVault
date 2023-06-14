
const express = require('express');
const app = express();

app.listen(5000, ()=>{
    console.log('Servidor corriendo en http://localhost:5000')
});

app.set('view engine', 'ejs');
app.use('/', require('./router'));
app.use(express.static('imagenes'));
app.use(express.static('styles'));

//PRUEBA DE COMMIT
