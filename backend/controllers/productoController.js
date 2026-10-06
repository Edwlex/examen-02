const { Producto, Categoria } = require('../models');

exports.crearProducto = async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (error) { res.status(500).json({ error: 'Error al crear producto' }); }
};

exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({ include: [{ model: Categoria, as: 'categoria' }] });
    res.json(productos);
  } catch (error) { res.status(500).json({ error: 'Error al obtener productos' }); }
};