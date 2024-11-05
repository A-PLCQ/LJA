// userController.js - Controller for User Operations

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const logger = require('../config/logger');
const authService = require('../services/authService');
const emailService = require('../services/emailService');
require('dotenv').config();

// Inscription de l'utilisateur
const registerUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const hashedPassword = await authService.hashPassword(password);

    await db.query('INSERT INTO users (email, mot_de_passe, nom) VALUES (?, ?, ?)', [
      email, hashedPassword, username
    ]);

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    logger.error(`Erreur lors de l'inscription: ${error.message}`);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Connexion de l'utilisateur
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    const user = users[0];
    const isMatch = await authService.comparePasswords(password, user.mot_de_passe);

    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    const token = authService.generateToken(user);
    const refreshToken = await authService.generateRefreshToken(user);

    res.json({ token, refreshToken });
  } catch (error) {
    logger.error(`Erreur lors de la connexion: ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupération du profil utilisateur connecté
const getUserProfile = async (req, res) => {
  try {
    const { id_utilisateur } = req.user;
    const [users] = await db.query('SELECT id_utilisateur, nom, email FROM users WHERE id_utilisateur = ?', [id_utilisateur]);

    if (users.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(users[0]);
  } catch (error) {
    logger.error(`Erreur lors de la récupération du profil: ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer tous les utilisateurs (accès réservé aux administrateurs)
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id_utilisateur, nom, prenom, email, telephone, adresse, role, last_login FROM users'
    );
    res.status(200).json(users);
  } catch (error) {
    logger.error(`Erreur lors de la récupération des utilisateurs : ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer les informations d'un utilisateur par ID (accès réservé aux administrateurs)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await db.query(
      'SELECT id_utilisateur, nom, prenom, email, telephone, adresse, role, last_login FROM users WHERE id_utilisateur = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(users[0]);
  } catch (error) {
    logger.error(`Erreur lors de la récupération de l'utilisateur : ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};



// Supprimer un utilisateur par ID (accès réservé aux administrateurs)
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM users WHERE id_utilisateur = ?', [id]);
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    logger.error(`Erreur lors de la suppression de l'utilisateur : ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Modifier le rôle d'un utilisateur (accès réservé aux administrateurs)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'manager', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide' });
    }

    await db.query('UPDATE users SET role = ? WHERE id_utilisateur = ?', [role, id]);
    res.status(200).json({ message: 'Rôle mis à jour avec succès' });
  } catch (error) {
    logger.error(`Erreur lors de la mise à jour du rôle : ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mise à jour du profil utilisateur
const updateUserProfile = async (req, res) => {
  try {
    const { id_utilisateur } = req.user;
    const { email, username, adresse, telephone } = req.body;

    await db.query(
      'UPDATE users SET email = ?, nom = ?, adresse = ?, telephone = ? WHERE id_utilisateur = ?',
      [email, username, adresse, telephone, id_utilisateur]
    );

    res.status(200).json({ message: 'Profil mis à jour avec succès' });
  } catch (error) {
    logger.error(`Erreur lors de la mise à jour du profil: ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Suppression du compte utilisateur
const deleteUser = async (req, res) => {
  try {
    const { id_utilisateur } = req.user;
    await db.query('DELETE FROM users WHERE id_utilisateur = ?', [id_utilisateur]);
    res.status(200).json({ message: 'Compte utilisateur supprimé avec succès' });
  } catch (error) {
    logger.error(`Erreur lors de la suppression de l'utilisateur: ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Demande de réinitialisation de mot de passe
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const [users] = await db.query('SELECT id_utilisateur FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // Génère un code à 6 chiffres
    const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // Expiration dans 15 minutes

    // Met à jour la base de données avec le code de réinitialisation et son expiration
    await db.query('UPDATE users SET reset_code = ?, reset_code_expiry = ? WHERE id_utilisateur = ?', [
      resetCode, resetCodeExpiry, users[0].id_utilisateur
    ]);

    // Envoie l'email avec le code de réinitialisation
    await emailService.sendResetEmail(email, resetCode);
    res.status(200).json({ message: 'Un email de réinitialisation a été envoyé' });
  } catch (error) {
    logger.error(`Erreur lors de la demande de réinitialisation: ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Réinitialisation du mot de passe
const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    // Vérifie si l'utilisateur existe avec le code de réinitialisation valide et non expiré
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? AND reset_code = ? AND reset_code_expiry > ?',
      [email, resetCode, Date.now()]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Code de réinitialisation invalide ou expiré' });
    }

    const user = users[0];

    // Vérifie si le nouveau mot de passe est identique à l'ancien
    const isSamePassword = await bcrypt.compare(newPassword, user.mot_de_passe);
    if (isSamePassword) {
      return res.status(400).json({ message: 'Le nouveau mot de passe doit être différent de l\'ancien' });
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe et supprimer le code de réinitialisation
    await db.query(
      'UPDATE users SET mot_de_passe = ?, reset_code = NULL, reset_code_expiry = NULL WHERE email = ?',
      [hashedPassword, email]
    );

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  requestPasswordReset,
  resetPassword,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserRole
};