// authController.js - Gestion de l'authentification
const { sequelize } = require('../models'); // Instance Sequelize
const authService = require('../services/authService');
const emailService = require('../services/emailService');
const moment = require('moment-timezone');


// Rafraîchir un token d'accès
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Token de rafraîchissement requis.' });
    }

    // Générer un nouveau token d'accès
    const tokens = await authService.refreshAccessToken(refreshToken);
    res.status(200).json(tokens);
  } catch (error) {
    res.status(401).json({ message: 'Token de rafraîchissement invalide ou expiré.', error: error.message });
  }
};

// Inscription d'un nouvel utilisateur
const registerUser = async (req, res) => {
  const t = await sequelize.transaction(); 
  try {
    const { email, mot_de_passe, nom, prenom, telephone, adresse } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }

    // Hacher le mot de passe
    const hashedPassword = await authService.hashPassword(mot_de_passe);

    // Créer l'utilisateur
    const newUser = await authService.createUser(
      { email, mot_de_passe: hashedPassword, nom, prenom, telephone, adresse },
      t
    );

    // Envoyer un email de vérification
    const verificationLink = `http://localhost:5005/auth/verify?email=${newUser.email}&code=${newUser.id}`;
    await emailService.sendVerificationEmail(newUser.email, verificationLink);

    // Valider la transaction
    await t.commit();
    res.status(201).json({ message: 'Utilisateur créé. Vérifiez votre email.' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Erreur lors de l\'inscription.', error: error.message });
  }
};

// Vérification d'email
const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.query;

    // Vérifier et marquer l'utilisateur comme vérifié
    await authService.verifyEmail(email, code);

    res.status(200).json({ message: 'Votre adresse email a été vérifiée avec succès.' });
  } catch (error) {
    res.status(400).json({ message: 'Lien de vérification invalide ou expiré.', error: error.message });
  }
};

// Connexion utilisateur
const loginUser = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    // Authentifier l'utilisateur
    const { accessToken, refreshToken } = await authService.login(
      email,
      mot_de_passe,
      req.ip,
      req.headers['user-agent']
    );

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(401).json({ message: 'Identifiants incorrects ou compte non vérifié.', error: error.message });
  }
};

// Déconnexion utilisateur
const logoutUser = async (req, res) => {
  try {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Token d\'accès requis.' });
    }

    const accessToken = authorizationHeader.split(' ')[1];
    const decoded = authService.verifyAccessToken(accessToken);

    // Révoquer les tokens de rafraîchissement associés à l'utilisateur
    const result = await authService.revokeTokensByUserId(decoded.id);

    if (!result) {
      return res.status(404).json({ message: 'Aucun token à révoquer pour cet utilisateur.' });
    }

    res.status(200).json({ message: 'Déconnexion réussie.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la déconnexion.', error: error.message });
  }
};

module.exports = {
  refreshAccessToken,
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
};
