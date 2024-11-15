
// userController.js - Contrôleur des utilisateurs
const { sequelize } = require('../models'); // Import de l'instance Sequelize
const authService = require('../services/authService');
const emailService = require('../services/emailService');
const moment = require('moment-timezone');
const { Users, RefreshTokens } = require('../models');

// Inscription d'un nouvel utilisateur
const registerUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { email, mot_de_passe, nom, prenom, telephone, adresse, siret } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }

    // Hacher le mot de passe
    const hashedPassword = await authService.hashPassword(mot_de_passe);

    // Créer un nouvel utilisateur dans une transaction
    const user = await Users.create({ email, mot_de_passe: hashedPassword, nom, prenom, telephone, adresse, siret }, { transaction: t });

    // Envoyer un email de vérification
    const verificationLink = `http://localhost:5005/users/verify?email=${user.email}&code=${user.id}`;
    await emailService.sendVerificationEmail(user.email, verificationLink);

    // Valider la transaction si tout s'est bien passé
    await t.commit();
    res.status(201).json({ message: 'Utilisateur créé. Vérifiez votre email.' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur.", error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.query;

    // Chercher l'utilisateur par email et vérifier le code
    const user = await Users.findOne({ where: { email, id: code } });
    if (!user) {
      return res.status(400).json({ message: "Lien de vérification invalide ou utilisateur introuvable." });
    }

    // Marquer l'utilisateur comme vérifié
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Votre adresse email a été vérifiée avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la vérification de l'email.", error: error.message });
  }
};

// Connexion utilisateur
const loginUser = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // Chercher l'utilisateur
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Vérifier si l'utilisateur a validé son email
    if (!user.isVerified) {
      return res.status(403).json({ message: "Veuillez vérifier votre email avant de vous connecter." });
    }

    // Vérifier le mot de passe
    const passwordMatch = await authService.comparePasswords(mot_de_passe, user.mot_de_passe);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }
    
    // Mettre à jour la date de dernière connexion
    user.last_login = moment().tz('Europe/Paris').format('YYYY-MM-DD HH:mm:ss');
    await user.save();

    // Générer les tokens
    const accessToken = authService.generateAccessToken(user);
    const refreshToken = await authService.generateRefreshToken(user, req.ip, req.headers['user-agent']);

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion de l'utilisateur.", error: error.message });
  }
};

// Déconnexion utilisateur
const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await authService.revokeRefreshToken(refreshToken);
    res.status(200).json({ message: 'Déconnexion réussie.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la déconnexion.', error: error.message });
  }
};

// Obtenir le profil de l'utilisateur
const getUserProfile = async (req, res) => {
  try {
    const user = await Users.findByPk(req.user.id, {
      attributes: ['nom', 'prenom', 'email', 'adresse', 'siret']
    });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du profil utilisateur.', error: error.message });
  }
};

// Mettre à jour le profil utilisateur
const updateUserProfile = async (req, res) => {
  try {
    const { nom, prenom, telephone, adresse, email } = req.body;
    const user = await Users.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    if (email && email !== user.email) {
      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
      }
      user.email = email;
    }
    user.nom = nom || user.nom;
    user.prenom = prenom || user.prenom;
    user.telephone = telephone || user.telephone;
    user.adresse = adresse || user.adresse;
    await user.save();

    res.status(200).json({ message: 'Profil mis à jour avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil.', error: error.message });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const { mot_de_passe } = req.body;
    const user = await Users.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Vérification du mot de passe avant suppression
    const passwordMatch = await authService.comparePasswords(mot_de_passe, user.mot_de_passe);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    await user.destroy();
    res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur.", error: error.message });
  }
};

// Demander la réinitialisation du mot de passe
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.reset_code = resetCode;
    user.reset_code_expiry = new Date(Date.now() + 15 * 60 * 1000); // Code valide pour 15 minutes
    await user.save();

    await emailService.sendResetEmail(user.email, resetCode);
    res.status(200).json({ message: 'Email de réinitialisation envoyé.' });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email de réinitialisation.", error: error.message });
  }
};

// Réinitialiser le mot de passe
const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    const user = await Users.findOne({ where: { email, reset_code: resetCode } });
    if (!user || user.reset_code_expiry < new Date()) {
      return res.status(400).json({ message: 'Code de réinitialisation invalide ou expiré.' });
    }

    user.mot_de_passe = await authService.hashPassword(newPassword);
    user.reset_code = null;
    user.reset_code_expiry = null;
    await user.save();

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe.', error: error.message });
  }
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  requestPasswordReset,
  resetPassword,
};
