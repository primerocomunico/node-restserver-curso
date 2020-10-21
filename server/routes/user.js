const express = require('express');
const bcrypt = require('bcrypt')
const _ = require('underscore')

const User = require('../models/user')

// Importar middlewares personalizados
const {verifyToken, verifyAdmin} = require('../middlewares/auth')

const app = express();

app.get('/users', verifyToken, function (req, res) {

    /*return res.json({
        user: req.user,
        nombre: req.user.nombre,
        email: req.user.email
    })*/

    // Controlar si el user es status true para ser mostrado
    // Utilizar {status: true} en .find y .countDocuments

    // Paginación de usuarios
    // http://localhost:3000/usuarios?limit=5&from=5
    let from = req.query.from || 0
    from = Number(from)
    let limit = req.query.limit || 5
    limit = Number(limit)

    // el parámetro en string dentro del .find son los campos que queremos mostrar en la petición GET
    User.find({
            status: true
        }, 'nombre email role status google img')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            // Retornar el número total de registros
            User.countDocuments({
                status: true
            }, (err, counter) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    users: users,
                    counter: counter
                })
            })
        })
})

app.post('/user', function (req, res) {
    let body = req.body

    // Crear estructura de usuario, basado en Schema de ../models/user.js
    let user = new User({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    // Guardar info que recoje el POST en la BBDD
    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        // Quitamos en la respuesta al cliente la key password
        // userDB.password = null

        res.json({
            ok: true,
            user: userDB
        })

    })

})

app.put('/user/:id', [verifyToken, verifyAdmin], function (req, res) {
    let id = req.params.id

    // _.pick permite elegir aquellos campos que si podrían ser modificados
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'status'])

    // {new: true} es un parámetro que devuelve el obj modificado
    // {runValidators: true} es un parámetro que corre todas las validadeciones definidas en el Schema
    User.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        })
    })
})

// Cambiar status: false para que no sea visualizado desde el front
app.delete('/user/:id', [verifyToken, verifyAdmin], function (req, res) {

    let id = req.params.id
    let changeStatus = {
        status: false
    }

    User.findByIdAndUpdate(id, changeStatus, {
        new: true
    }, (err, userDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            user: userDeleted
        })
    })
})

// Borrando el registro
/*app.delete('/usuario/:id', function (req, res) {
    
    let id = req.params.id
    User.findByIdAndRemove(id, (err, userDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!userDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            user: userDeleted
        })
    })
})*/

module.exports = app;