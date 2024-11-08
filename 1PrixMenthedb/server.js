require('dotenv').config(); // Charger les variables d'environnement
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const logger = require('./app/config/logger');
const config = require('./app/config/config');

// Importation des routes
const userRoutes = require('./app/routes/userRoutes');


// Importation des middlewares
const errorHandlerMiddleware = require('./app/middlewares/errorHandler'); 
const authMiddleware = require('./app/middlewares/authMiddleware').authMiddleware;

// Initialisation de l'application express
const app = express();
const PORT = config.port || 5005; // Utiliser le port défini dans config.js

// Configuration pour les proxys si nécessaire
app.set('trust proxy', 1);

// Middlewares de sécurité
app.use(helmet()); // Sécurise les headers HTTP
app.use(cors());   // Active CORS pour permettre les requêtes cross-origin


// Middleware de logging
app.use(morgan('combined', { stream: logger.stream }));

// Middleware pour analyser le corps des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour servir les fichiers statiques (ex. images uploadées)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Définition des routes
app.use('/api/users', userRoutes); // Routes utilisateur


// Middleware pour gérer les routes non trouvées (404)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// Utilisation du middleware de gestion des erreurs
app.use(errorHandlerMiddleware);

// Route d'accueil (exemple)
app.get('/', (req, res) => {
  res.status(200).send('Bienvenue sur l\'API de votre application e-commerce');
});

// Lancer le serveur
app.listen(PORT, () => {
  logger.info(`Le serveur est lancé sur http://localhost:${PORT}`);
});

module.exports = app;
