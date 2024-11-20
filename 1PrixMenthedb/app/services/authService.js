const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { RefreshTokens, Users } = require('../models');
const logger = require('../config/logger');

// Générer un token d'accès
const generateAccessToken = (user) => {
  try {
    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '15m', // Durée de vie du token d'accès
      audience: 'ecommerce_app',
      issuer: 'auth_service',
    });

    logger.info(`Token d'accès généré pour l'utilisateur ${user.id}`);
    return token;
  } catch (error) {
    logger.error(`Erreur lors de la génération du token d'accès : ${error.message}`);
    throw new Error('Erreur interne lors de la génération du token.');
  }
};

// Générer un token de rafraîchissementconst 
generateRefreshToken = async (user, ipAddress = 'unknown', deviceInfo = 'unknown') => {
  try {
    // Remplacement explicite de ::1 par 127.0.0.1
    const sanitizedIpAddress = ipAddress === '::1' ? '127.0.0.1' : ipAddress;

    // Générer un token de rafraîchissement
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: '7d', // Durée de vie du token de rafraîchissement
        audience: 'ecommerce_app',
        issuer: 'auth_service',
      }
    );

    // Sauvegarder le token dans la base
    await RefreshTokens.create({
      user_id: user.id,
      token: refreshToken,
      ip_address: sanitizedIpAddress,
      device_info: deviceInfo,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expire dans 7 jours
    });

    logger.info(`Token de rafraîchissement généré pour l'utilisateur ${user.id}`);
    return refreshToken;
  } catch (error) {
    logger.error(`Erreur lors de la génération du token de rafraîchissement : ${error.message}`);
    throw new Error('Erreur interne lors de la génération du token de rafraîchissement.');
  }
};

// Vérifier un token d'accès
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      audience: 'ecommerce_app',
      issuer: 'auth_service',
    });

    logger.info(`Token d'accès vérifié avec succès pour l'utilisateur ${decoded.id}`);
    return decoded;
  } catch (error) {
    logger.warn(`Erreur lors de la vérification du token d'accès : ${error.message}`);
    throw new Error('Token invalide ou expiré.');
  }
};

// Vérifier un token de rafraîchissement
const verifyRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      audience: 'ecommerce_app',
      issuer: 'auth_service',
    });

    const refreshToken = await RefreshTokens.findOne({
      where: { token, is_revoked: false },
    });

    if (!refreshToken) {
      throw new Error('Token de rafraîchissement introuvable ou révoqué.');
    }

    if (new Date() > refreshToken.expires_at) {
      logger.warn('Token de rafraîchissement expiré.');
      throw new Error('Token de rafraîchissement expiré.');
    }

    logger.info(`Token valide pour l'utilisateur ID: ${decoded.id}`);
    return decoded;
  } catch (error) {
    logger.warn(`Erreur lors de la vérification du token de rafraîchissement : ${error.message}`);
    throw new Error('Token de rafraîchissement invalide ou expiré.');
  }
};

// Rafraîchir un token d'accès
const refreshAccessToken = async (refreshToken) => {
  try {
    logger.info(`Requête pour rafraîchir le token : ${refreshToken}`);
    
    const decoded = await verifyRefreshToken(refreshToken);

    const user = await Users.findByPk(decoded.id);
    if (!user) {
      logger.warn('Utilisateur introuvable lors du rafraîchissement du token.');
      throw new Error('Utilisateur introuvable.');
    }

    const tokenToRevoke = await RefreshTokens.findOne({ where: { token: refreshToken } });
    if (!tokenToRevoke) {
      logger.warn('Token de rafraîchissement introuvable dans la base.');
      throw new Error('Token invalide ou déjà révoqué.');
    }

    await tokenToRevoke.destroy();
    logger.info(`Token de rafraîchissement révoqué pour l'utilisateur ${user.id}`);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    logger.info(`Nouveaux tokens générés pour l'utilisateur ${user.id}`);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    logger.error(`Erreur lors du rafraîchissement des tokens : ${error.message}`);
    throw new Error('Impossible de rafraîchir les tokens.');
  }
};

// Révoquer un token de rafraîchissement
const revokeTokensByUserId = async (userId) => {
  try {
    const refreshTokens = await RefreshTokens.findAll({ where: { user_id: userId } });

    if (!refreshTokens.length) {
      logger.warn(`Aucun token trouvé pour l'utilisateur ${userId}.`);
      return false; // Aucun token à révoquer
    }

    await Promise.all(refreshTokens.map(token => token.destroy())); // Supprimer tous les tokens
    logger.info(`Tous les tokens de rafraîchissement révoqués pour l'utilisateur ${userId}.`);

    return true; // Révocation réussie
  } catch (error) {
    logger.error(`Erreur lors de la révocation des tokens pour l'utilisateur ${userId} : ${error.message}`);
    throw new Error('Erreur interne lors de la révocation des tokens.');
  }
};

// Hacher un mot de passe
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12); // Génération du sel
    const hashedPassword = await bcrypt.hash(password, salt); // Hachage
    logger.info('Mot de passe haché avec succès.');
    return hashedPassword;
  } catch (error) {
    logger.error(`Erreur lors du hachage du mot de passe : ${error.message}`);
    throw new Error('Erreur interne lors du hachage du mot de passe.');
  }
};

// Comparer les mots de passe
const comparePasswords = async (plainPassword, hashedPassword) => {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    if (!match) {
      logger.warn('Mot de passe incorrect.');
    }
    return match;
  } catch (error) {
    logger.error(`Erreur lors de la comparaison des mots de passe : ${error.message}`);
    throw new Error('Erreur interne lors de la comparaison des mots de passe.');
  }
};

// Rechercher un utilisateur par email
const findUserByEmail = async (email) => {
  try {
    const user = await Users.findOne({ where: { email } });
    return user;
  } catch (error) {
    logger.error(`Erreur lors de la recherche de l'utilisateur par email : ${error.message}`);
    throw new Error("Erreur interne lors de la recherche de l'utilisateur.");
  }
};

// Créer un utilisateur
const createUser = async (userData, transaction) => {
  try {
    const newUser = await Users.create(userData, { transaction });
    logger.info(`Nouvel utilisateur créé avec succès : ${newUser.email}`);
    return newUser;
  } catch (error) {
    logger.error(`Erreur lors de la création de l'utilisateur : ${error.message}`);
    throw new Error("Erreur interne lors de la création de l'utilisateur.");
  }
};

// Vérifier l'email d'un utilisateur
const verifyEmail = async (email, code) => {
  try {
    const user = await Users.findOne({ where: { email, id: code } });

    if (!user) {
      throw new Error('Lien de vérification invalide ou utilisateur introuvable.');
    }

    user.isVerified = true; // Marquer l'utilisateur comme vérifié
    await user.save();

    logger.info(`Utilisateur vérifié avec succès : ${user.email}`);
  } catch (error) {
    logger.error(`Erreur lors de la vérification de l'email : ${error.message}`);
    throw error; // Relancer l'erreur pour qu'elle soit capturée dans le contrôleur
  }
};

// Gérer la connexion d'un utilisateur
const login = async (email, motDePasse, ipAddress, userAgent) => {
  try {
    // Rechercher l'utilisateur par email
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      throw new Error('Email ou mot de passe incorrect.');
    }

    // Vérifier si l'utilisateur a validé son email
    if (!user.isVerified) {
      throw new Error('Votre compte n\'est pas encore vérifié.');
    }

    // Comparer les mots de passe
    const passwordMatch = await comparePasswords(motDePasse, user.mot_de_passe);
    if (!passwordMatch) {
      throw new Error('Email ou mot de passe incorrect.');
    }

    // Générer les tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user, ipAddress, userAgent);

    logger.info(`Connexion réussie pour l'utilisateur ${user.email}`);
    return { accessToken, refreshToken };
  } catch (error) {
    logger.error(`Erreur lors de la connexion : ${error.message}`);
    throw error; // Relancer l'erreur pour qu'elle soit capturée dans le contrôleur
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  refreshAccessToken,
  revokeTokensByUserId,
  hashPassword,
  comparePasswords,
  findUserByEmail,
  createUser,
  verifyEmail,
  login,
};
