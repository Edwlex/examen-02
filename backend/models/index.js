const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Modelo Usuario
const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.ENUM('administrador', 'moderador', 'usuario'), defaultValue: 'usuario' }
}, {
  tableName: 'usuarios',
  freezeTableName: true,
  timestamps: true
});

// Modelo Categoria
const Categoria = sequelize.define('Categoria', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.STRING }
}, {
  tableName: 'categorias',
  freezeTableName: true,
  timestamps: true
});

// Modelo Producto
const Producto = sequelize.define('Producto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false },
  categoriaId: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'productos',
  freezeTableName: true,
  timestamps: true
});

// RELACIONES
Categoria.hasMany(Producto, { foreignKey: 'categoriaId', as: 'productos' });
Producto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });

module.exports = { Usuario, Categoria, Producto, sequelize };