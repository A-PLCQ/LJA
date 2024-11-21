import api from './api';

// Fonction pour récupérer les articles du panier
export const getCartItems = async () => {
  const response = await api.get('/cart');
  return response.data;
};

// Fonction pour ajouter un article au panier
export const addCartItem = async (itemData) => {
  const response = await api.post('/cart', itemData);
  return response.data;
};

// Fonction pour mettre à jour un article du panier
export const updateCartItem = async (id, itemData) => {
  const response = await api.put(`/cart/${id}`, itemData);
  return response.data;
};

// Fonction pour supprimer un article du panier
export const deleteCartItem = async (id) => {
  const response = await api.delete(`/cart/${id}`);
  return response.data;
};

// Fonction pour vider le panier
export const clearCart = async () => {
  const response = await api.delete('/cart');
  return response.data;
};

export default {
  getCartItems,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart,
};
