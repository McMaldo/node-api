const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const api = express();
api.use(express.json());
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

db.connect((err) => {
    if(err){
        console.log("connection error", err);
        return;
    }
    console.log('connection okey')
})
const PORT = 3000;
api.listen(PORT, () => console.log(`port: ${PORT}`))

api.get('/', (req, res) => {
    res.send('Bienvenido a la API en Node.js de @McMaldo')
})

/**
 * Conteo de todos los paises disponibles
 * 
 * @returns {count: int} numero total de todos los paises disponibles;
 */
api.get('/countries', (req, res) => {
    db.query(`SELECT COUNT(*) FROM countries;`, (err,results) => {
        if(err) {
            res.status(500).json({message : err.message});
            return;
        }
        res.json(results);
    });
});

/**
 * Muestra de todos los paises disponibles
 * 
 * @returns {array} listado de todos los paises ordenados por mayor area con datos como:
 * name, area, national_day, region_name, continent_name;
 */
api.get('/countries/all', (req, res) => {
    db.query(`SELECT countries.name, countries.area, countries.national_day,
        regions.name AS region, continents.name AS continent FROM countries 
        INNER JOIN regions ON regions.region_id = countries.region_id
        INNER JOIN continents ON continents.continent_id = regions.continent_id
        ORDER BY countries.area DESC;`, (err,results) => {
        if(err) {
            res.status(500).json({message : err.message});
            return;
        }
        res.json(results);
    });
});

/**
 * Busqueda de un Pais
 * 
 * @param {:name} Nombre del pais a buscar
 * @returns {array} detalles del pais como:
 * name, area, national_day, region_name, continent_name;
 */
api.get('/countries/:name', (req, res) => {
    const {name} = req.params;
    console.log(req);
    db.query(`SELECT countries.name, countries.area, countries.national_day,
        regions.name AS region, continents.name AS continent FROM countries 
        INNER JOIN regions ON regions.region_id = countries.region_id
        INNER JOIN continents ON continents.continent_id = regions.continent_id
        WHERE countries.name = ?`, [name], (err,results) => {
        if(err) {
            res.status(500).json({message : err.message});
            return;
        }
        if(results == ''){
            res.status(500).json({message : "country undefined"});
            return;
        }
        res.json(results);
    });
});