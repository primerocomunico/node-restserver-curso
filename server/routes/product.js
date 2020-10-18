const express = require('express');

let Product = require('../models/product')

// // Importar middlewares personalizados
let {verifyToken, verifyAdmin} = require('../middlewares/auth')

let app = express()

// GET - Mostrar todos los productos
app.get('/products', verifyToken, (req, res) => {
    // Paginación
    // http://localhost:3000/products?limit=5&from=5
    let from = req.query.from || 0
    from = Number(from)
    let limit = req.query.limit || 10
    limit = Number(limit)

    // Solo mostrar los productos disponibles
    Product.find({available: true})
    .skip(from)
    .limit(limit)
    .populate('user', 'nombre')
    .populate('category', 'description')
    .exec((err, products) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            products
        })
    })
})

// GET - Mostrar un único producto by id
app.get('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id

    Product.findById(id)
    .populate('user', 'nombre')
    .populate('category', 'description')
    .exec((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Hay un error con el ID del producto',
                    err
                }
            })
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }
        res.json({
            ok: true,
            product: productDB
        })
    })
})

// GET - Búsqueda de productos específicos
app.get('/product/search/:title', verifyToken, (req, res) => {

    let title = req.params.title
    // 'i' Es para eliminar la insensibilidad entre mayúsculas y minúsculas
    let regex = new RegExp(title, 'i')

    Product.find({name: regex})
    .populate('category', 'description')
    .exec( (err, products) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!products) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            products: products
        })
    })
})

// POST - Crear un nuevo producto
app.post('/product', verifyToken, (req, res) => {
    let body = req.body

    // Crear el producto según la estructura del esquema
    let product = new Product({
        name: body.name,
        prize: body.prize,
        description: body.description,
        available: body.available,
        user: req.user._id,
        category: body.category
    })

    // Guardar el producto
    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
         res.json({
             ok: true,
             product: productDB
         })
    })
})

// PUT - Editar un producto
app.put('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id
    let body = req.body

    let editProduct = {
        name: body.name,
        prize: body.prize,
        description: body.description,
        available: body.available,
        category: body.category
    }

     // {new: true} es un parámetro que devuelve el obj modificado
     // {runValidators: true} es un parámetro que corre todas las validadeciones definidas en el Schema
     Product.findByIdAndUpdate(id, editProduct, {new: true, runValidators: true}, (err, productDB) => {
         if (err) {
             return res.status(500).json({
                 ok: false,
                 err
             })
         }
         if (!productDB) {
             return res.status(400).json({
                 ok: false,
                 err: {
                     message: `El producto ${editProduct.name} no está disponible`
                 }
             })
         }
         res.json({
             ok: true,
             product: productDB
         })
     })
})

// DELETE - Borrar un producto, solo por el usuario ADMIN_ROLE
app.delete('/product/:id', [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id

    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        // Cambiar la disponibilidad a False para que no aparezca en el GET
        productDB.available = false
        productDB.save((err, disabledProduct) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!disabledProduct) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                })
            }
            res.json({
                ok: true,
                message: `El producto ${disabledProduct.name} ha sido eliminado`
            })
        })
    })
})


module.exports = app