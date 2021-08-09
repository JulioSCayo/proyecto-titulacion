const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const app = express();

// Enviroment variables
app.set('port', process.env.PORT || 4000);

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('', require('./routes/usuarios.routes'));
// app.use('', require('./routes/login.routes'));
app.use('/public', express.static(path.resolve('public')));


module.exports = app;