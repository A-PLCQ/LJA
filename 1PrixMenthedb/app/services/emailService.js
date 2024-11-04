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
});

const sendResetEmail = async (email, resetCode) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Votre code de réinitialisation est : ${resetCode}. Ce code est valide pour une durée limitée.`,
      html: `<p>Votre code de réinitialisation est : <b>${resetCode}</b></p><p>Ce code est valide pour une durée limitée.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email de réinitialisation envoyé à :', email);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error);
    throw new Error('L\'email de réinitialisation n\'a pas pu être envoyé');
  }
};

module.exports = {
  sendResetEmail,
};
