import api from './api';

// Fonction pour l'inscription d'un utilisateur
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Fonction pour la connexion de l'utilisateur
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  localStorage.setItem('authToken', response.data.accessToken);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  return response.data;
};

// Fonction pour la déconnexion
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
};

// Fonction pour rafraîchir le token d'accès
export const refreshToken = async () => {
  const response = await api.post('/auth/refresh-token', {
    refreshToken: localStorage.getItem('refreshToken'),
  });
  localStorage.setItem('authToken', response.data.accessToken);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  return response.data;
};

// Fonction pour vérifier l'email d'un utilisateur après l'inscription
export const verifyEmail = async (email, code) => {
  const response = await api.get(`/auth/verify?email=${email}&code=${code}`);
  return response.data;
};

export default {
  register,
  login,
  logout,
  refreshToken,
  verifyEmail,
};
