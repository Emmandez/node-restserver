require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

//Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./routes/usuario'));



mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    console.log(process.env.URLDB);

    if (err) throw new Error(err);

    console.log('Base de datos ONLINES');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto :' + process.env.PORT);
})