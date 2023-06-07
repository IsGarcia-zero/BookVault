
const mysql = require('mysql');
const conexion = mysql.createConnection({
    host:'localhost',
    database:'bookvault',
    user:'root',
    password: ''
});

conexion.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log('CONEXION EXITOSA');
    }
});


module.exports= conexion;