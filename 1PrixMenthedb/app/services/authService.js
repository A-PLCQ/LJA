// Import des modules nécessaires
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logger = require('../config/logger'); // Logger pour enregistrer les erreurs
const RefreshTokens = require('../models/RefreshTokens');
const Users = require('../models/Users');

// Vérifie la configuration des secrets JWT
const checkJwtSecrets = () => {
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT secrets must be defined in the environment variables');
  }
};

// Fonction pour hacher un mot de passe
const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

// Fonction pour comparer un mot de passe avec un hash
const comparePasswords = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

// Générer un token d'accès
const generateAccessToken = (user) => {
  checkJwtSecrets();
  
  if (!Number.isInteger(user.id_utilisateur)) {
    throw new Error("L'identifiant utilisateur fourni n'est pas un nombre valide.");
  }

  return jwt.sign(
    { id_utilisateur: user.id_utilisateur, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '1h' } // Expiration configurable
  );
};

// Générer un token de rafraîchissement
const generateRefreshToken = async (user) => {
  checkJwtSecrets();

  const refreshToken = jwt.sign({}, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' });

  // Stockage du token de rafraîchissement dans la base de données
  await RefreshTokens.create({
    token: refreshToken,
    user_id: user.id_utilisateur,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ip_address: user.ip_address, // Si disponible
    device_info: user.device_info, // Si disponible
  });

  return refreshToken;
};

// Vérifier le token d'accès
const verifyAccessToken = (token) => {
  checkJwtSecrets();
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!Number.isInteger(decoded.id_utilisateur)) {
      throw new Error("L'identifiant utilisateur extrait du token n'est pas un nombre valide.");
    }
    return decoded;
  } catch (error) {
    logger.error(`Erreur lors de la vérification du token d'accès: ${error.message}`);
    throw new Error("Token d'accès invalide ou expiré");
  }
};

// Vérifier le token de rafraîchissement
const verifyRefreshToken = (token) => {
  checkJwtSecrets();
  
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    logger.error(`Erreur lors de la vérification du token de rafraîchissement: ${error.message}`);
    throw new Error('Token de rafraîchissement invalide ou expiré');
  }
};

// Rafraîchir le token d'accès
const refreshAccessToken = async (refreshToken) => {
  verifyRefreshToken(refreshToken);

  // Vérifie si le token est valide et non révoqué
  const tokenRecord = await RefreshTokens.findOne({
    where: { token: refreshToken, is_revoked: false },
    include: { model: Users, attributes: ['id_utilisateur', 'role', 'nom', 'prenom', 'email'] },
  });

  if (!tokenRecord || !tokenRecord.User) {
    throw new Error('Token de rafraîchissement invalide ou révoqué, ou utilisateur introuvable');
  }

  return generateAccessToken(tokenRecord.User);
};

// Révoquer le token de rafraîchissement
const revokeRefreshToken = async (refreshToken) => {
  verifyRefreshToken(refreshToken);
  
  const result = await RefreshTokens.update(
    { is_revoked: true },
    { where: { token: refreshToken } }
  );

  if (result[0] === 0) {
    logger.warn("Le token de rafraîchissement n'a pas été trouvé ou a déjà été révoqué");
    throw new Error("Le token de rafraîchissement n'a pas été trouvé ou a déjà été révoqué");
  }

  logger.info(`Token de rafraîchissement révoqué: ${refreshToken}`);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  refreshAccessToken,
  revokeRefreshToken,
  hashPassword,
  comparePasswords,
};
