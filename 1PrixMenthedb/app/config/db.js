// db.js - Fichier pour créer la connexion à la base de données MySQL
const mysql = require('mysql2/promise');
const config = require('./config'); // Charger la configuration centrale

// Créer la connexion avec les informations de `config.js`
const db = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  port: config.db.port || 3306, // Par défaut, MySQL utilise le port 3306
  waitForConnections: true,
  connectionLimit: config.db.connectionLimit,
  queueLimit: 0
});

module.exports = db;
