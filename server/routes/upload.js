const express = require('express');
const fileUpload = require('express-fileupload');
const app = express()

const {verifyToken} = require('../middlewares/auth')

const fs = require('fs')
const path = require('path')

// Importamos el esquema para que el archivo se guarde en la BBDD
const User = require('../models/user')
const Product = require('../models/product')

// Middleware upload
app.use(fileUpload({
    useTempFiles: true
}));

// El argumento :type nos permite definir si es un archivo de product o de user
app.put('/upload/:type/:id', verifyToken, (req, res) => {

    let type = req.params.type
    let id = req.params.id

    // Comprobar si no hay ningún archivo para subir
    if (!req.files) {
          return res.status(400).json({
              ok: false,
              err: {
                  message: 'No se ha enviado ningún archivo'
              }
          })
    }

    // Validar el tipo de archivo
    let validTypes = ['products', 'users']
    if ( validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Solo están permitidos los tipos: ' + validTypes.join(', ')
            }
        })
    }

    // Cuando si hay un archivo para subir (newFile será la key a utilizar en postman)
    let sampleFile = req.files.newFile
    //let completeFileName = sampleFile.name
    let splitNameFile = sampleFile.name.split('.')
    let fileExt = splitNameFile[splitNameFile.length - 1]
    // Restricción de tipo de archivos
    let validExtentions = ['png', 'jpg', 'gif', 'jpeg']
    // Si el resultado de indexOf es menor que 0, significa que no existía nada en el array validExtentions
    if (validExtentions.indexOf(fileExt) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extenciones de archivo válidas son: ' + validExtentions.join(', ')
            }
        })
    }

    // Cambiar el nombre del archivo
    let uniqueFileName = `${id}-${new Date().getMilliseconds(3)}.${fileExt}`

    // Paso para subir el archivo
    // En la url el primer param es el tipo de archivo y se relaciona con la carpeta donde se guarda dicho archivo. El segundo param es el nombre del archivo
    sampleFile.mv(
            `uploads/${type}/${uniqueFileName}`,
            function (err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        // Opción para poder actualizar la imagen (info) del usuario en la DDBB
        if (type == 'users') {
            userImage(id, res, uniqueFileName)
        }

        // Opción para poder actualizar la imagen (info) del producto en la DDBB
        if (type == 'products') {
            productImage(id, res, uniqueFileName)
        }
    })
})

function userImage(id, res, uniqueFileName) {
    User.findById(id, (err, userDB) => {
        if (err) {
            // Borramos la imagen aunque haya un error con la BBDD
            deleteFile(uniqueFileName, 'users')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        // Verificar que el usuario existe
        if (!userDB) {
            deleteFile(uniqueFileName, 'users')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario NO existe'
                }
            })
        }

        // Confirmar si el usuario ya cuenta con una imagen, para borrarla y solo guardaría la nueva
        // Se utiliza aquí userDB, porque es el único lugar donde tenemos respuesta correcta de la BBDD
        deleteFile(userDB.img, 'users')

        // img viene de la estructura del esquema de la base de datos
        userDB.img = uniqueFileName
        userDB.save( (err, userSaved) => {
            res.json({
                ok: true, 
                user: userSaved,
                image: uniqueFileName
            })
        })
    })
}

function productImage(id, res, uniqueFileName) {
    Product.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(uniqueFileName, 'products')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productDB) {
            deleteFile(uniqueFileName, 'products')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto NO existe'
                }
            })
        }

        deleteFile(productDB.img, 'products')

        productDB.img = uniqueFileName
        productDB.save( (err, productSaved) => {
            res.json({
                ok: true,
                product: productSaved,
                image: uniqueFileName
            })
        })
    })
}

// Identifica si existe un path previo, si existe, se elimina para así evitar duplicidad de imágenes del mismo usuario
function deleteFile(fileName, type) {
    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${fileName}`)
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage)
    }
}

module.exports = app;