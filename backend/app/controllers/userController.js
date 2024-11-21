// userController.js - Gestion des utilisateurs
const { sequelize } = require('../models');
const authService = require('../services/authService');
const emailService = require('../services/emailService');
const { Users } = require('../models');
const { NotFoundError, ValidationError, UnauthorizedError, InternalServerError } = require('../helpers/customErrors');

// Obtenir le profil de l'utilisateur
const getUserProfile = async (req, res, next) => {
  try {
    const user = await Users.findByPk(req.user.id, {
      attributes: ['nom', 'prenom', 'email', 'adresse', 'siret', 'telephone']
    });
    if (!user) {
      throw new NotFoundError('Utilisateur non trouvé.');
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Mettre à jour le profil utilisateur
const updateUserProfile = async (req, res, next) => {
  try {
    const { nom, prenom, telephone, adresse, email } = req.body;
    const user = await Users.findByPk(req.user.id);

    if (!user) {
      throw new NotFoundError('Utilisateur non trouvé.');
    }

    // Vérifier si l'email est déjà utilisé
    if (email && email !== user.email) {
      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) {
        throw new ValidationError('Un utilisateur avec cet email existe déjà.');
      }
      user.email = email;
    }

    // Mettre à jour les autres champs
    user.nom = nom || user.nom;
    user.prenom = prenom || user.prenom;
    user.telephone = telephone || user.telephone;
    user.adresse = adresse || user.adresse;
    await user.save();

    res.status(200).json({ message: 'Profil mis à jour avec succès.' });
  } catch (error) {
    next(error);
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res, next) => {
  try {
    const { mot_de_passe } = req.body;
    const user = await Users.findByPk(req.user.id);

    if (!user) {
      throw new NotFoundError('Utilisateur non trouvé.');
    }

    // Vérification du mot de passe avant suppression
    const passwordMatch = await authService.comparePasswords(mot_de_passe, user.mot_de_passe);
    if (!passwordMatch) {
      throw new UnauthorizedError('Mot de passe incorrect.');
    }

    await user.destroy();
    res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    next(error);
  }
};

// Demander la réinitialisation du mot de passe
const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundError('Utilisateur non trouvé.');
    }

    // Générer un code de réinitialisation
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.reset_code = resetCode;
    user.reset_code_expiry = new Date(Date.now() + 15 * 60 * 1000); // Code valide pour 15 minutes
    await user.save();

    // Envoyer un email avec le code
    await emailService.sendResetEmail(user.email, resetCode);
    res.status(200).json({ message: 'Email de réinitialisation envoyé.' });
  } catch (error) {
    next(error);
  }
};

// Réinitialiser le mot de passe
const resetPassword = async (req, res, next) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    const user = await Users.findOne({ where: { email, reset_code: resetCode } });

    if (!user || user.reset_code_expiry < new Date()) {
      throw new ValidationError('Code de réinitialisation invalide ou expiré.');
    }

    // Mettre à jour le mot de passe
    user.mot_de_passe = await authService.hashPassword(newPassword);
    user.reset_code = null;
    user.reset_code_expiry = null;
    await user.save();

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUser,
  requestPasswordReset,
  resetPassword,
};
