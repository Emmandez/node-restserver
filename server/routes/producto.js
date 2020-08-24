const express = require('express');
const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
let Producto = require('../models/producto');

//Obtener todos los productos
//populate
// usuario y categoria
// paginado
app.get('/productos', verificaToken, (req, res) => {

    let desde = Number(req.query.desde) || 0;

    let limite = Number(req.query.limit) || 5;

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!productos) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'No hay productos'
                    }
                })
            }

            return res.json({
                ok: true,
                productos
            })

        });
});

//Obtener un producto por Id
//Populate usuario y categoria
app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontró un producto con ese Id'
                    }
                });
            }

            return res.json({
                ok: true,
                producto: productDB
            })
        });
});

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');


    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                productos
            });
        });
});


//Crear producto
app.post('/productos', verificaToken, (req, res) => {
    //grabar usuario 
    //Grabar una categoria del listado
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        });
    });


});

//Actualizar producto
app.put('/productos/:id', verificaToken, (req, res) => {
    //grabar usuario 
    //Grabar una categoria del listado
    let id = req.params.id;
    let body = req.body

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        });

    })
});


//borrar producto
//cambiar disponible a false 
app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = { disponible: false }

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        });

    })

});


module.exports = app;