const express = require('express');

let Category = require('../models/category')

// // Importar middlewares personalizados
let {verifyToken, verifyAdmin} = require('../middlewares/auth')

let app = express()

// GET - Mostrar todas las categorías
app.get('/categories', verifyToken, (req, res) => {
    Category.find({})
    // .populate() nos permite identificar a través del objectID la coincidencia en otras tablas con el mismo objectID y así traer información complementaria de otras tablas
    .populate('user', 'nombre email google')
    // .sort() odena la respuesta
    .sort('description')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categories
            })
        })
})

// GET - Mostrar categoría by id
app.get('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id

    Category.findById(id)
    .populate('user', 'nombre')
    .exec((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoría no existe'
                }
            })
        }
        res.json({
            ok: true,
            category: categoryDB
        })
    })
})

// POST - Crear una nueva categoría
app.post('/category', verifyToken, (req, res) => {
    let body = req.body

    // Crear la categoría
    let category = new Category({
        description: body.description,
        user: req.user._id
    })

    // Guardar la categoría
    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            category: categoryDB
        })
    })
})

// PUT - Editar una categoria
app.put('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id
    let body = req.body

    let descCategory = {
        description: body.description
    }

    // {new: true} es un parámetro que devuelve el obj modificado
    // {runValidators: true} es un parámetro que corre todas las validadeciones definidas en el Schema
    Category.findByIdAndUpdate(id, descCategory, {new: true, runValidators: true}, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            category: categoryDB
        })
    })
})

// DELETE - Eliminar una categoría, solo por el usuario ADMIN_ROLE
app.delete('/category/:id', [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id

    Category.findByIdAndRemove(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoría no existe'
                }
            })
        }
        res.json({
            ok: true,
            message: 'Categoría eliminada'
        })
    })
})

module.exports = app