const jwt = require('jsonwebtoken');
const { Users } = require('../models'); // Vérifie que l'import est correct
const logger = require('../config/logger'); // Winston pour la journalisation
const { UnauthorizedError } = require('../helpers/customErrors');

// Middleware de validation du token d'accès
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('En-tête Authorization manquant ou mal formé.');
      return res.status(401).json({ message: 'Token manquant ou invalide.' });
    }

    // Extraction du token
    const token = authHeader.split(' ')[1];
    logger.debug(`Token reçu dans Authorization : ${token}`);

    // Décodage sans vérification pour diagnostic
    const decodedWithoutVerify = jwt.decode(token, { complete: true });
    logger.debug(`Payload décodé sans vérification : ${JSON.stringify(decodedWithoutVerify)}`);

    // Vérification du token avec JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      audience: 'ecommerce_app',
      issuer: 'auth_service',
    });

    logger.info(`Token vérifié avec succès pour l'utilisateur ${decoded.id}`);

    // Charger l'utilisateur depuis la base de données
    const user = await Users.findByPk(decoded.id);
    if (!user) {
      logger.warn(`Utilisateur introuvable pour l'ID ${decoded.id}`);
      return res.status(401).json({ message: 'Utilisateur introuvable.' });
    }

    // Ajouter l'utilisateur à la requête pour une utilisation ultérieure
    req.user = user;
    logger.info(`Utilisateur authentifié : ${user.id}, rôle : ${user.role}`);
    next();
  } catch (error) {
    // Gestion des erreurs spécifiques JWT
    if (error.name === 'TokenExpiredError') {
      logger.warn('Token expiré.');
      return res.status(401).json({ message: 'Votre session a expiré. Veuillez vous reconnecter.' });
    }
    if (error.name === 'JsonWebTokenError') {
      logger.error('Signature du token invalide.');
      return res.status(401).json({ message: 'Token invalide ou modifié.' });
    }
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ message: error.message });
    }

    // Gestion des erreurs inattendues
    logger.error(`Erreur dans authMiddleware : ${error.message}`);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

// Middleware de vérification des rôles
const roleMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        logger.warn('Accès non autorisé. Aucun utilisateur authentifié.');
        return res.status(401).json({ message: 'Accès non autorisé. Veuillez vous connecter.' });
      }

      if (!requiredRoles.includes(req.user.role)) {
        logger.warn(
          `Permissions insuffisantes pour l'utilisateur ${req.user.id} (${req.user.role}). Rôles requis : ${requiredRoles}.`
        );
        return res.status(403).json({ message: 'Accès refusé. Permissions insuffisantes.' });
      }

      logger.info(`Utilisateur autorisé à accéder à cette ressource : ${req.user.id}`);
      next();
    } catch (error) {
      logger.error(`Erreur dans roleMiddleware : ${error.message}`);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware,
};
