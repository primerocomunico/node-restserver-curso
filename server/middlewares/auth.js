require('../config/config.js')
const jwt = require('jsonwebtoken');

// VERIFICAR TOKEN  
let verifyToken = (req, res, next) => {
    let token = req.get('auth');

    // Confirmar que el token es válido
    jwt.verify(token, process.env.FIRM_TOKEN, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                err: err
            })
        }

        // Lo que solicita el usuario va ser igual al token decodificado
        // Solicita el user que se ha identificado a través del token
        req.user = decoded.user;
        next();
    })
}

// VERIFICAR ADMIN ROLE
let verifyAdmin = (req, res, next) => {
    let userRole = req.user.role

    if (userRole == "ADMIN_ROLE") {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }
}

// VERIFICAR TOKEN IMAGEN
let verifyTokenImg = (req, res, next) => {
    // token viene definido de la query param en la url
    let token = req.query.token
    
    // Confirmar que el token es válido
    jwt.verify(token, process.env.FIRM_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: err
            })
        }

        // Lo que solicita el usuario va ser igual al token decodificado
        // Solicita el user que se ha identificado a través del token
        req.user = decoded.user;
        next();
    })
}

module.exports = {
    verifyToken, verifyAdmin, verifyTokenImg
}