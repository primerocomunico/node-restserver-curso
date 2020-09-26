const mongoose = require('mongoose')

// npm install - validador de mails únicos
const uniqueValidator = require('mongoose-unique-validator')

// Lista de roles válidos
let validRoles =  {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE}, no es un role válido'
}

let Schema = mongoose.Schema

let userSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

// Quitar password del obj response de userDB
userSchema.methods.toJSON = function() {
    let usuario = this;
    let userObject = usuario.toObject()
    delete userObject.password
    return userObject
}

userSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'})

module.exports = mongoose.model('user', userSchema)