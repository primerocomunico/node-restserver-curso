require('./config/config.js')
const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use( require('./routes/user.js'))

// BBDD Online
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err
    console.log('BBDD online!');
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto 3000');
})