// emailService.js - Service de gestion des emails

const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

// Initialisation de nodemailer avec SMTP
const transporter = nodemailer.createTransport({
  host: config.email.host,  // Utiliser l'hôte configuré
  port: config.email.port,  // Utiliser le port configuré
  secure: config.email.port === 465, // true pour SSL (port 465), false pour TLS (port 587)
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

// Envoyer un email de réinitialisation de mot de passe
const sendResetEmail = async (userEmail, resetCode) => {
  const mailOptions = {
    from: '"Support E-Commerce" <support@example.com>',
    to: userEmail,
    subject: 'Réinitialisation de votre mot de passe',
    text: `Bonjour,

Vous avez demandé à réinitialiser votre mot de passe. Voici votre code de réinitialisation : ${resetCode}

Ce code est valable pendant 15 minutes.

Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.

Merci,
L'équipe Support E-Commerce.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Email de réinitialisation envoyé à ${userEmail}`);
  } catch (error) {
    logger.error(`Erreur lors de l'envoi de l'email de réinitialisation à ${userEmail}: ${error.message}`);
    throw new Error("Impossible d'envoyer l'email de réinitialisation");
  }
};

// Envoyer un email de vérification après inscription
const sendVerificationEmail = async (userEmail, verificationLink) => {
  const mailOptions = {
    from: '"Support E-Commerce" <support@example.com>',
    to: userEmail,
    subject: 'Vérifiez votre adresse email',
    text: `Bonjour,

Merci de vous être inscrit sur notre site. Pour vérifier votre adresse email, cliquez sur le lien ci-dessous :

${verificationLink}

Ce lien est valable pendant 24 heures.

Merci,
L'équipe Support E-Commerce.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Email de vérification envoyé à ${userEmail}`);
  } catch (error) {
    logger.error(`Erreur lors de l'envoi de l'email de vérification à ${userEmail}: ${error.message}`);
    throw new Error("Impossible d'envoyer l'email de vérification");
  }
};

module.exports = {
  sendResetEmail,
  sendVerificationEmail,
};
