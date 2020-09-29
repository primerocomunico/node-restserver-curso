require('../config/config.js')
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Config Google sign in
const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    // las keys del obj vienen del Schema de usuario
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

// LOGIN Google
app.post('/google', async (req, res) => {
    // googleToken es la variable definida en index.html linea 20
    let token = req.body.googleToken

    let googleUser = await verify(token)
    .catch( err => {
        return res.status(403).json({
            ok: false,
            err: err
        })
    });

    // Validaciones y registro del googleUser en la BBDD
    User.findOne({email: googleUser.email}, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            })
        }

        // Comprobar si el usuario existe ya en la BBDD
        if(userDB) {
            // Comprobar si el usuario no se ha registrado via Google
            if(userDB.google == false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Ya está registrado en nuestra base de datos'
                    }
                })
            } else {
                // Creación token, ya que el usuario si se ha autenticado por Google == true
                let token = jwt.sign({
                    user: userDB
                }, process.env.FIRM_TOKEN, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                })

                return res.json({
                    ok: true,
                    user: userDB,
                    token: token
                })
            }
        } else {
            // Si el usuario no existe en la BBDD y se crea por primera vez con los datos de Google
            let newUser = new User();
            newUser.nombre = googleUser.nombre;
            newUser.email = googleUser.email;
            newUser.img = googleUser.img;
            newUser.google = true;
            // Solo para fines de validación de la BBDD
            newUser.password = ':)'

            // Salvar la info del user creado en la BBDD
            newUser.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: err
                    })
                }
                let token = jwt.sign({
                    user: userDB
                }, process.env.FIRM_TOKEN, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                })

                return res.json({
                    ok: true,
                    user: userDB,
                    token: token
                })
            })
        }
    })
})



module.exports = app;