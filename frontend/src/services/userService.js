import api from './api';

// Fonction pour récupérer le profil de l'utilisateur
export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

// Fonction pour mettre à jour le profil de l'utilisateur
export const updateUserProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

// Fonction pour supprimer un utilisateur
export const deleteUser = async (password) => {
  const response = await api.delete('/users/delete', {
    data: { mot_de_passe: password },
  });
  return response.data;
};

// Fonction pour demander la réinitialisation du mot de passe
export const requestPasswordReset = async (email) => {
  const response = await api.post('/users/password-reset/request', { email });
  return response.data;
};

// Fonction pour réinitialiser le mot de passe
export const resetPassword = async (email, resetCode, newPassword) => {
  const response = await api.post('/users/password-reset/reset', {
    email,
    resetCode,
    newPassword,
  });
  return response.data;
};

export default {
  getUserProfile,
  updateUserProfile,
  deleteUser,
  requestPasswordReset,
  resetPassword,
};
