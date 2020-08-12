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