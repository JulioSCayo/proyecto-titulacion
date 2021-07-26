const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// Enviroment variables
app.set('port', process.env.PORT || 4000);

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes/usuarios.routes'));

module.exports = app;