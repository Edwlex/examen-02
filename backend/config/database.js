const { Sequelize } = require('sequelize');

// Render proporciona la URL de la base de datos en la variable de entorno DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Obligatorio para la conexión segura de Render
    }
  }
});

module.exports = sequelize;