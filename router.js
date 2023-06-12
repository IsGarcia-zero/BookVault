const express = require('express');
const router = express.Router();
const conexion = require('./database/db');

router.get('/inicio', (req, res) => {
    // Primera consulta
    conexion.query('SELECT  * FROM LIBRO', (error, results1) => {
        if (error) {
            throw error;
        } else {
            // Segunda consulta
            conexion.query('SELECT DISTINCT genero FROM LIBRO', (error, results2) => {
                if (error) {
                    throw error;
                } else {
                    conexion.query('SELECT COUNT(*) AS cantidad FROM (SELECT DISTINCT genero FROM LIBRO) AS subquery;', (error, results3) => {
                        if (error) {
                            throw error;
                        } else {
                            res.render('mostrarlibros', { results1: results1, results2: results2, results3: results3 });
                        }
                    });
                }
            });
        }
    });
});



module.exports = router;