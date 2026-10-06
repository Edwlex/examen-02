const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, Categoria, Producto, sequelize } = require('./models');
const { verificarToken, verificarRol } = require('./middlewares/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

// --- AUTH ---
app.post('/api/registrar', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await Usuario.create({ nombre, email, password: hashedPassword, rol });
    res.status(201).json({ message: 'Usuario registrado' });
  } catch (error) { 
    res.status(500).json({ error: 'Error al registrar' }); 
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol }, 
      process.env.JWT_SECRET, 
      { expiresIn: '8h' }
    );
    res.json({ token, rol: usuario.rol, nombre: usuario.nombre });
  } catch (error) { 
    res.status(500).json({ error: 'Error en login' }); 
  }
});

// --- CRUD CATEGORIAS ---
app.get('/api/categorias', verificarToken, async (req, res) => {
  const categorias = await Categoria.findAll();
  res.json(categorias);
});

app.post('/api/categorias', verificarToken, verificarRol(['administrador']), async (req, res) => {
  const cat = await Categoria.create(req.body);
  res.status(201).json(cat);
});

// --- CRUD PRODUCTOS ---
app.get('/api/productos', verificarToken, async (req, res) => {
  const productos = await Producto.findAll({ include: [{ model: Categoria, as: 'categoria' }] });
  res.json(productos);
});

// Crear (Admin y Moderador)
app.post('/api/productos', verificarToken, verificarRol(['administrador', 'moderador']), async (req, res) => {
  const prod = await Producto.create(req.body);
  res.status(201).json(prod);
});

// Editar (Admin y Moderador)
app.put('/api/productos/:id', verificarToken, verificarRol(['administrador', 'moderador']), async (req, res) => {
  const [updated] = await Producto.update(req.body, { where: { id: req.params.id } });
  if (!updated) return res.status(404).json({ error: 'No encontrado' });
  const prod = await Producto.findByPk(req.params.id);
  res.json(prod);
});

// Eliminar (Solo Admin)
app.delete('/api/productos/:id', verificarToken, verificarRol(['administrador']), async (req, res) => {
  const deleted = await Producto.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ error: 'No encontrado' });
  res.json({ message: 'Eliminado' });
});

// --- SINCRONIZAR BD (sin forzar, porque ya creamos las tablas manualmente con SQL) ---
sequelize.sync().then(() => {
  console.log('✅ BD Sincronizada correctamente');
}).catch(err => {
  console.error('❌ Error al sincronizar BD:', err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor Enterprise corriendo en puerto ${PORT}`));