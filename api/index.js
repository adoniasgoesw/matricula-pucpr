const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { cadastrarAluno } = require('./matriculaController');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/matricula', cadastrarAluno);

module.exports = app; 