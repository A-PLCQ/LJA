import api from './api';

// Fonction pour récupérer la liste des imprimantes
export const getPrinters = async () => {
  const response = await api.get('/printers');
  return response.data;
};

// Fonction pour récupérer les détails d'une imprimante par ID
export const getPrinterById = async (id) => {
  const response = await api.get(`/printers/${id}`);
  return response.data;
};

// Fonction pour ajouter une nouvelle imprimante (admin ou manager requis)
export const addPrinter = async (printerData) => {
  const response = await api.post('/printers', printerData);
  return response.data;
};

// Fonction pour mettre à jour les informations d'une imprimante
export const updatePrinter = async (id, printerData) => {
  const response = await api.put(`/printers/${id}`, printerData);
  return response.data;
};

// Fonction pour supprimer une imprimante
export const deletePrinter = async (id) => {
  const response = await api.delete(`/printers/${id}`);
  return response.data;
};

export default {
  getPrinters,
  getPrinterById,
  addPrinter,
  updatePrinter,
  deletePrinter,
};
