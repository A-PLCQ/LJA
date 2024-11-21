// controllersAdmin/userControllerAdmin.js - Contrôleur pour les fonctionnalités administrateur

const { User } = require('../models');
const { HTTP_STATUS } = require('../config/constants');

// Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'nom', 'prenom', 'email', 'role', 'isVerified'] });
    res.status(HTTP_STATUS.OK).json(users);
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: 'Erreur lors de la récupération des utilisateurs.', error: error.message });
  }
};

// Récupérer les informations d’un utilisateur par ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: [
        'id', 'nom', 'prenom', 'email', 'role', 'isVerified',
        'telephone', 'adresse', 'siret', 'last_login', 'reset_code', 'reset_code_expiry'
      ]
    });
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Utilisateur non trouvé.' });
    }
    res.status(HTTP_STATUS.OK).json(user);
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: "Erreur lors de la récupération de l'utilisateur.", error: error.message });
  }
};

// Modifier le rôle d’un utilisateur
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const validRoles = ['user', 'manager', 'admin'];

    if (!validRoles.includes(role)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Rôle invalide. Les rôles valides sont: user, manager, admin.' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Utilisateur non trouvé.' });
    }
    user.role = role;
    await user.save();
    res.status(HTTP_STATUS.OK).json({ message: "Rôle de l'utilisateur mis à jour avec succès." });
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: "Erreur lors de la mise à jour du rôle de l'utilisateur.", error: error.message });
  }
};

// Supprimer un utilisateur par ID
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Utilisateur non trouvé.' });
    }
    await user.destroy();
    res.status(HTTP_STATUS.OK).json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: "Erreur lors de la suppression de l'utilisateur.", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUserById,
};
