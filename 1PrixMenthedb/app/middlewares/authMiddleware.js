// authMiddleware.js - Middleware d'authentification avec gestion des rôles
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../config/logger'); // Utilisation de Winston pour la journalisation

// Middleware d'authentification de base avec des améliorations de sécurité
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger.warn('Token manquant ou mauvais format');
            return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
        }

        const token = authHeader.split(' ')[1];
        if (!token || typeof token !== 'string' || token.length < 20) {
            logger.warn('Token invalide ou corrompu');
            return res.status(401).json({ message: 'Accès non autorisé. Token invalide.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            audience: 'ecommerce_app',
            issuer: 'auth_service',
        });

        if (!decoded || !decoded.id_utilisateur) {
            logger.warn('Erreur de décodage du token');
            return res.status(401).json({ message: 'Accès non autorisé. Token invalide.' });
        }

        const user = await User.findByPk(decoded.id_utilisateur);
        if (!user) {
            logger.warn('Utilisateur non trouvé');
            return res.status(401).json({ message: 'Utilisateur non trouvé.' });
        }

        req.user = user;
        logger.info('Utilisateur authentifié avec succès', { userId: user.id_utilisateur });
        next();
    } catch (error) {
        logger.error('Erreur du middleware auth:', { message: error.message });
        return res.status(401).json({ message: 'Accès non autorisé. Token invalide ou expiré.' });
    }
};

// Middleware de vérification des rôles avec des améliorations de sécurité
const roleMiddleware = (requiredRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            logger.warn('Accès non autorisé. Utilisateur non authentifié.');
            return res.status(401).json({ message: 'Accès non autorisé. Utilisateur non authentifié.' });
        }

        if (!requiredRoles.includes(req.user.role)) {
            logger.warn('Accès refusé. Permissions insuffisantes', { userId: req.user.id_utilisateur, role: req.user.role });
            return res.status(403).json({ message: 'Accès refusé. Permissions insuffisantes.' });
        }

        logger.info('Utilisateur autorisé à accéder à cette route', { userId: req.user.id_utilisateur, role: req.user.role });
        next();
    };
};

module.exports = {
    authMiddleware,
    roleMiddleware,
};
