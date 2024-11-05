const db = require('../config/db');
const { NotFoundError, ValidationError } = require('../helpers/customErrors');
const logger = require('../config/logger');

// Récupérer tous les consommables
const getAllConsumables = async (req, res) => {
  try {
    const [consumables] = await db.query(`
      SELECT c.*, i.url AS primary_image 
      FROM consumables c 
      LEFT JOIN images i ON i.id_consumable = c.id_consumable AND i.is_primary = TRUE
    `);

    // Remplacement des backslashes par des slashes dans le chemin d'image
    consumables.forEach(consumable => {
      if (consumable.primary_image) {
        consumable.primary_image = consumable.primary_image.replace(/\\/g, '/').replace(/ /g, '-');
      }
    });

    res.status(200).json(consumables);
  } catch (error) {
    logger.error(`Erreur lors de la récupération des consommables : ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer un consommable par ID avec ses imprimantes compatibles et images
const getConsumableById = async (req, res) => {
  const { id } = req.params;
  try {
    // Récupérer les détails du consommable
    const [consumables] = await db.query('SELECT * FROM consumables WHERE id_consumable = ?', [id]);
    if (consumables.length === 0) throw new NotFoundError('Consommable non trouvé');
    const consumable = consumables[0];

    // Récupérer toutes les images du consommable avec l'image principale en premier
    const [images] = await db.query(`
      SELECT url 
      FROM images 
      WHERE id_consumable = ? 
      ORDER BY is_primary DESC
    `, [id]);

    // Remplacement des backslashes par des slashes dans le chemin d'image
    consumable.images = images.map(img => img.url.replace(/\\/g, '/').replace(/ /g, '%20'));

    // Récupérer les imprimantes compatibles avec le consommable
    const [compatiblePrinters] = await db.query(`
      SELECT p.* 
      FROM printers p
      JOIN compatible_printers cp ON cp.id_printer = p.id_printer
      WHERE cp.id_consumable = ?
    `, [id]);

    // Ajouter les imprimantes compatibles à l'objet du consommable
    consumable.compatiblePrinters = compatiblePrinters;

    res.status(200).json(consumable);
  } catch (error) {
    logger.error(`Erreur lors de la récupération du consommable : ${error.message}`);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Ajouter un nouveau consommable
const createConsumable = async (req, res) => {
  const { brand, model, reference, price, weight_kg, page_capacity, size, color, stock } = req.body;

  try {
    if (!brand || !model || !reference || !price) {
      throw new ValidationError('Les champs obligatoires sont manquants');
    }

    await db.query(
      'INSERT INTO consumables (brand, model, reference, price, weight_kg, page_capacity, size, color, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [brand, model, reference, price, weight_kg, page_capacity, size, color, stock]
    );

    res.status(201).json({ message: 'Consommable ajouté avec succès' });
  } catch (error) {
    logger.error(`Erreur lors de l'ajout du consommable : ${error.message}`);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Mettre à jour un consommable par ID
const updateConsumable = async (req, res) => {
  const { id } = req.params;
  const { brand, model, reference, price, weight_kg, page_capacity, size, color, stock } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE consumables SET brand = ?, model = ?, reference = ?, price = ?, weight_kg = ?, page_capacity = ?, size = ?, color = ?, stock = ? WHERE id_consumable = ?',
      [brand, model, reference, price, weight_kg, page_capacity, size, color, stock, id]
    );

    if (result.affectedRows === 0) throw new NotFoundError('Consommable non trouvé');
    res.status(200).json({ message: 'Consommable mis à jour avec succès' });
  } catch (error) {
    logger.error(`Erreur lors de la mise à jour du consommable : ${error.message}`);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Supprimer un consommable par ID
const deleteConsumable = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM consumables WHERE id_consumable = ?', [id]);
    if (result.affectedRows === 0) throw new NotFoundError('Consommable non trouvé');
    res.status(200).json({ message: 'Consommable supprimé avec succès' });
  } catch (error) {
    logger.error(`Erreur lors de la suppression du consommable : ${error.message}`);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  getAllConsumables,
  getConsumableById,
  createConsumable,
  updateConsumable,
  deleteConsumable,
};
