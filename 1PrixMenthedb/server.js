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
const printerRoutes = require('./app/routes/printerRoutes'); 
const consumableRoutes = require('./app/routes/consumableRoutes');
const compatibleRoutes = require('./app/routes/compatibleRoutes');
const imageRoutes = require('./app/routes/imageRoutes');
const cartRoutes = require('./app/routes/cartRoutes');

// const orderRoutes = require('./app/routes/orderRoutes'); // Routes des commandes (à créer)
// const paymentRoutes = require('./app/routes/paymentRoutes'); // Routes de paiement (à créer)

// Importation des middlewares
const errorHandlerMiddleware = require('./app/middlewares/errorHandler'); // Renommé pour éviter la confusion
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
app.use('/api/printers', printerRoutes); // Routes d'imprimantes
app.use('/api/consumables', consumableRoutes); // Routes pour les consommables
app.use('/api/images', imageRoutes); // Routes pour la gestion des images
app.use('/api/compatibility', compatibleRoutes); // Routes de compatibilité
app.use('/api/cart', authMiddleware, cartRoutes); // Routes panier (protégé par authMiddleware)

// app.use('/api/orders', authMiddleware, orderRoutes); // Routes de commandes (protégé par authMiddleware)
// app.use('/api/payments', authMiddleware, paymentRoutes); // Routes de paiement (protégé par authMiddleware)

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
