// db.js - Fichier central pour la gestion de la connexion Sequelize uniquement

require('dotenv').config();
const { Sequelize } = require('sequelize');
const config = require('./config');

// Initialiser la connexion directement ici
const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
  host: config.db.host,
  dialect: 'mysql', 
  port: config.db.port || 3306,
  pool: {
    max: config.db.connectionLimit || 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false, // Logs en développement
});

// Synchroniser la base de données
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Toutes les tables ont été synchronisées avec succès.');
  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation avec la base de données :', error);
  });

// Exporter la connexion Sequelize
module.exports = {
  sequelize,
};
