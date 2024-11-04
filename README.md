# Listado de ENDPOINTS

1- Conteo de todos los paises disponibles
- returns {count: int} numero total de todos los paises disponibles;

```js
api.get('/countries', (req, res) => {
    db.query(`SELECT COUNT(*) FROM countries;`, (err,results) => {
        if(err) {
            res.status(500).json({message : err.message});
            return;
        }
        res.json(results);
    });
});
```

2- Muestra de todos los paises disponibles
- returns {array} listado de todos los paises ordenados por mayor area con datos como:
    + name
    + area
    + national_day
    + region_name
    + continent_name

```js
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
```

3- Busqueda de un Pais
- param {:name} Nombre del pais a buscar
- returns {array} detalles del pais como:
    + name
    + area
    + national_day
    + region_name
    + continent_name

```js
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
```

## How to Create NodeAPI

1- command
```sh
npm init -y
npm install express
npm install --save-dev nodemon
```
2- add to package.json:
```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js", //add
    "dev": "nodemon index.js" //add
  },
```
3- command
```sh
npm install dotenv
npm install mysql2
```
4- create .env file
```.env
DB_HOST=...
DB_USER=...
DB_PASS=...
DB_NAME=...
```
5- create index.js
```js
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
```
6- add "CORS Unlock" to Chrome
Finally- NodeAPI already made