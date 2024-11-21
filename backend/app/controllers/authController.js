// authController.js - Gestion de l'authentification
const { sequelize } = require('../models'); // Instance Sequelize
const authService = require('../services/authService');
const emailService = require('../services/emailService');
const moment = require('moment-timezone');
const { NotFoundError, ValidationError, UnauthorizedError, InternalServerError } = require('../helpers/customErrors');

// Rafraîchir un token d'accès
const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError('Token de rafraîchissement requis.');
    }

    // Générer un nouveau token d'accès
    const tokens = await authService.refreshAccessToken(refreshToken);
    res.status(200).json(tokens);
  } catch (error) {
    next(new UnauthorizedError('Token de rafraîchissement invalide ou expiré.'));
  }
};

// Inscription d'un nouvel utilisateur
const registerUser = async (req, res, next) => {
  const t = await sequelize.transaction(); 
  try {
    const { email, mot_de_passe, nom, prenom, telephone, adresse, siret } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      throw new ValidationError('Un utilisateur avec cet email existe déjà.');
    }

    // Hacher le mot de passe
    const hashedPassword = await authService.hashPassword(mot_de_passe);

    // Créer l'utilisateur
    const newUser = await authService.createUser(
      { email, mot_de_passe: hashedPassword, nom, prenom, telephone, adresse, siret }, 
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
    next(new InternalServerError("Erreur lors de l'inscription."));
  }
};

// Vérification d'email
const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.query;

    // Vérifier et marquer l'utilisateur comme vérifié
    await authService.verifyEmail(email, code);

    res.status(200).json({ message: 'Votre adresse email a été vérifiée avec succès.' });
  } catch (error) {
    next(new ValidationError('Lien de vérification invalide ou expiré.'));
  }
};

// Connexion utilisateur
const loginUser = async (req, res, next) => {
  try {
    const { email, mot_de_passe } = req.body;

    // Authentifier l'utilisateur
    const { accessToken, refreshToken, user } = await authService.login(
      email,
      mot_de_passe,
      req.ip,
      req.headers['user-agent']
    );

    user.last_login = new Date();
    await user.save();

    // Répondre avec les tokens d'authentification
    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    next(new UnauthorizedError('Identifiants incorrects ou compte non vérifié.'));
  }
};

// Déconnexion utilisateur
const logoutUser = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      throw new UnauthorizedError("Token d'accès requis.");
    }

    const accessToken = authorizationHeader.split(' ')[1];
    const decoded = authService.verifyAccessToken(accessToken);

    // Révoquer les tokens de rafraîchissement associés à l'utilisateur
    const result = await authService.revokeTokensByUserId(decoded.id);

    if (!result) {
      throw new NotFoundError("Aucun token à révoquer pour cet utilisateur.");
    }

    res.status(200).json({ message: 'Déconnexion réussie.' });
  } catch (error) {
    next(new InternalServerError('Erreur lors de la déconnexion.'));
  }
};

module.exports = {
  refreshAccessToken,
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
};