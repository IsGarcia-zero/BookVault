const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'BOOKVAULT',
    user: 'root',
    password: ''
});

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Se conecto a la base de datos');
    }
});

module.exports = connection;