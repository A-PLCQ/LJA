// stringUtils.js - Fonctions utilitaires pour la manipulation des chaînes de caractères

// Fonction pour convertir une chaîne en slug (utilisé pour les URLs)
const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\\/g, '/') // Remplacer les backslashes par des slashes
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .replace(/[^\w\-\/]+/g, '') // Retirer les caractères non alphanumériques, sauf les slashes
      .replace(/\-\-+/g, '-') // Remplacer plusieurs tirets par un seul
      .replace(/^-+/, '') // Retirer les tirets en début de chaîne
      .replace(/-+$/, ''); // Retirer les tirets en fin de chaîne
  };
  
  // Fonction pour tronquer une chaîne si elle dépasse une certaine longueur
  const truncate = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  // Fonction pour convertir la première lettre de chaque mot en majuscule
  const capitalizeWords = (text) => {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  
  // Fonction pour supprimer les espaces en début et fin de chaîne
  const trim = (text) => {
    return text.trim();
  };
  
  module.exports = {
    slugify,
    truncate,
    capitalizeWords,
    trim,
  };
  