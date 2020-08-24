//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//BD
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.9vtaj.mongodb.net/cafe?retryWrites=true&w=majority`
}


process.env.URLDB = urlDB;

//Vencimiento del Token
// 60 segundos
// 60 min 
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = '48h';


//Seed de autenticación
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

//CLIENT ID GOOGLE
process.env.CLIENT_ID = process.env.CLIENT_ID || '11629379890-5erj1bor398q21j7r3ts707kt3hvpipk.apps.googleusercontent.com'