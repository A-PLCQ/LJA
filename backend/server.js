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
const authRoutes = require('./app/routes/authRoutes');
const adminRoutes = require('./app/routes/adminRoutes');
const userRoutes = require('./app/routes/userRoutes');
const imageRoutes = require('./app/routes/imageRoutes');
const printerRoutes = require('./app/routes/printerRoutes');
const consumableRoutes = require('./app/routes/consumableRoutes');
const compatiblesRoutes = require('./app/routes/compatibleRoutes');
const cartRoutes = require('./app/routes/cartRoutes');

// Importation des middlewares
const errorHandlerMiddleware = require('./app/middlewares/errorHandler'); 
const authMiddleware = require('./app/middlewares/authMiddleware').authMiddleware;

// Initialisation de l'application express
const app = express();
const PORT = config.port || 5005; // Utiliser le port défini dans config.js

// Configuration pour les proxys si nécessaire
app.set('trust proxy', 1);

// Middlewares de sécurité
app.use(helmet({
  contentSecurityPolicy: false, // Désactive la politique de sécurité de contenu qui pourrait bloquer les ressources
  crossOriginResourcePolicy: { policy: "cross-origin" } // Permet le chargement des ressources provenant d'origines différentes
}));

// Configuration dynamique du middleware CORS
const allowedOrigins = process.env.NODE_ENV === 'production' ? 
  ['https://mon-site-en-prod.com', 'https://app.mon-site-en-prod.com'] : 
  ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Permettre l'envoi de cookies si nécessaire
}));

// Middleware de logging
app.use(morgan('combined', { stream: logger.stream }));

// Middleware pour analyser le corps des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour servir les fichiers statiques (ex. images uploadées)
// Ajouter les headers CORS nécessaires aux ressources statiques
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Définition des routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes); 
app.use('/users', userRoutes); 
app.use('/images', imageRoutes); 
app.use('/printer', printerRoutes); 
app.use('/consumable', consumableRoutes);
app.use('/compatibles', compatiblesRoutes); 
app.use('/cart', cartRoutes);

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
