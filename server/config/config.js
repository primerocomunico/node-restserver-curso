// PUERTO
process.env.PORT = process.env.PORT || 3000;

// ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// TOKEN
// 60 segundos * 60 minutos * 24 horas
process.env.CADUCIDAD_TOKEN =  '30d';
// Secret / Firma
process.env.FIRM_TOKEN = process.env.FIRM_TOKEN || 'esta-es-la-firma-develop'

// BBDD
let urlDB;
if(process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/super-cafe'
} else {
    urlDB = process.env.MONGO_URI
}
process.env.URLDB = urlDB

// VARIABLE HEROKU MONGODB CONNECTION
// heroku config MONGO_URI

// VARIABLE HEROKU FIRM
// heroku config FIRM_TOKEN