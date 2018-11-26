const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const path = require('path');
const moment = require('moment')
moment.locale('es');
const routes = require('./routes/users')

// settings
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

// routing
app.use('/api', routes)
app.use(express.static(path.join(__dirname, 'public/dist/CensoLoteka')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/dist/CensoLoteka/index.html'))
})

module.exports = app