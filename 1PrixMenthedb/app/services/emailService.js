const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV !== 'development',
  },
});

// Fonction pour créer un template d'email en fonction du type
const createEmailTemplate = (type, code) => {
  let subject = '';
  let text = '';
  let html = '';

  switch (type) {
    case 'reset':
      subject = 'Réinitialisation de votre mot de passe';
      text = `Votre code de réinitialisation est : ${code}. Ce code est valide pour une durée limitée.`;
      html = `<p>Votre code de réinitialisation est : <b>${code}</b></p><p>Ce code est valide pour une durée limitée.</p>`;
      break;

    case 'verification':
      subject = 'Vérification de votre compte';
      text = `Votre code de vérification est : ${code}. Ce code est valide pour une durée limitée.`;
      html = `<p>Votre code de vérification est : <b>${code}</b></p><p>Ce code est valide pour une durée limitée.</p>`;
      break;

    default:
      throw new Error('Type d\'email non supporté');
  }

  return { subject, text, html };
};

// Fonction générique pour envoyer un email
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email envoyé à : ${to} | Sujet : ${subject}`);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error);
    throw new Error(`L'email n'a pas pu être envoyé à ${to} : ${error.message}`);
  }
};

// Fonction pour envoyer un email de réinitialisation de mot de passe
const sendResetEmail = async (email, resetCode) => {
  const { subject, text, html } = createEmailTemplate('reset', resetCode);
  await sendEmail(email, subject, text, html);
};

// Fonction pour envoyer un email de vérification d’inscription
const sendVerificationEmail = async (email, verificationCode) => {
  const { subject, text, html } = createEmailTemplate('verification', verificationCode);
  await sendEmail(email, subject, text, html);
};

module.exports = {
  sendResetEmail,
  sendVerificationEmail,
};
