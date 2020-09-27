require('../config/config.js')
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body

    User.findOne({email: body.email}, (err, userDB) => {
        // Error interno de la BBDD
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        // Si el usuario NO existe
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario incorrecto'
                }
            })
        }

        // Si la contraseña NO existe
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Contraseña incorrecta'
                }
            })
        }

        // Creación token
        let token = jwt.sign({
            user: userDB
        }, process.env.FIRM_TOKEN, {
        expiresIn: process.env.CADUCIDAD_TOKEN
        })

        // Respuesta de conexión
        res.json({
            ok: true,
            user: userDB,
            token: token
        })
    })
})



module.exports = app;