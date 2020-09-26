// PUERTO
process.env.PORT = process.env.PORT || 3000;

// ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// BBDD
let urlDB;
if(process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/super-cafe'
} else {
    urlDB = 'mongodb+srv://sergioges:SY2DqRqvOEgKwafJ@cluster0.li0ob.mongodb.net/super-cafe?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB