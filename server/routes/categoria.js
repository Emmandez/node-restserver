const express = require('express');
let app = express();
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let Categoria = require('../models/categoria');
const _ = require('underscore');
const categoria = require('../models/categoria');

//Todas las rutas deben de verificar el token
//Usar postman

//Todas las categorias
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((error, categorias) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    err: error
                })
            }

            if (categorias.length == 0) {
                return res.json({
                    ok: true,
                    message: 'No hay categorias'
                });
            }

            return res.json({
                ok: true,
                categorias,
            });

        });

});

//Mostrar una categoría por ID
//FindById
app.get('/categoria/:id', verificaToken, (req, res) => {

    let token = req.params.id

    Categoria.findById(token, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(404).json({
                ok: false,
                message: 'Categoria no encontrada'
            })
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//Crear una nueva categoría
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });


});

//Actualizar una categoría por ID
//
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion', 'usuario']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//Borrar una categoría por ID
//Solo Admin puede borrar y token
//Eliminado físico
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id o existe'
                }
            })
        }


        return res.json({
            ok: true,
            message: 'La categoria fue eliminada'
        })

    });

});










module.exports = app;