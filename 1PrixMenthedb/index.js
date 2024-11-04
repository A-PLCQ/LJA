// index.js - Entry Point for the PrixMentheDB API

require('dotenv').config(); // Charger les variables d'environnement
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const logger = require('./app/config/logger'); // Chemin ajusté pour logger

// Importer config.js avec un chemin simple
const config = require('./app/config/config');

// Routes imports
const userRoutes = require('./app/routes/userRoutes');


// Middleware imports
const errorHandler = require('./app/middlewares/errorHandler');
const authMiddleware = require('./app/middlewares/authMiddleware');

// Create express app
const app = express();
const PORT = config.port || 5005; // Utiliser le port défini dans config.js

// Activer 'trust proxy' pour les proxys (nécessaire si l'app est derrière un proxy, ex. Heroku)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());
app.use(cors());

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre de temps
});
app.use(limiter);

// Logging Middleware
app.use(morgan('combined', { stream: logger.stream }));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Middleware pour servir les images du dossier 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/printers', printerRoutes);
app.use('/api/consumables', consumableRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', authMiddleware, cartRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);
app.use('/api/images', imageRoutes);

// Default Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
