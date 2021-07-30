const express = require('express');
const router = express.Router();
const productos = require('../api/productos');

router.get('/productos/listar', async (req, res) => {
    res.json(await productos.listar());
});

router.get('/productos/listar/:id', async (req, res) => {
    let { id } = req.params;
    res.json(await productos.buscarPorId(id));
});

router.post('/productos/guardar', async (req, res) => {
    console.log('data en router',req.body)
    res.json(await productos.guardar(req.body));
});

router.put('/productos/actualizar/:id', async (req, res) => {
    let { id } = req.params;
    res.json(await productos.actualizar(id, req.body));
});

router.delete('/productos/borrar/:id', async (req, res) => {
    let { id } = req.params;
    res.json(await productos.borrar(id));
});


module.exports = router;