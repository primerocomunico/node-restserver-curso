const express = require('express')
const fs = require('fs')
// Construimos el path obsoluto de un archivo (toda la url completa)
const path = require('path')

// Importar middlewares personalizados para mantener las imágenes seguras
const {verifyTokenImg} = require('../middlewares/auth')

let app = express()

app.get('/image/:type/:img', verifyTokenImg, (req, res) => {
    let type = req.params.type
    let img = req.params.img

    // Si el archivo solicitado no existe, se envía una imagen en blanco
    let pathNoImg = path.resolve(__dirname, '../assets/no-Image.jpg')

    // Path de una imagen que existe
    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${img}`)

    // Confirmar si la imagen existe
    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage)
    } else {
        res.sendFile(pathNoImg)
    }


})

module.exports = app