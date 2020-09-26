// PUERTO
process.env.PORT = process.env.PORT || 3000;

// ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// BBDD
let urlDB;
if(process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/super-cafe'
} else {
    urlDB = process.env.mongoUrl
}

process.env.URLDB = urlDB