// consumableController.js - Gestion des opérations pour les consommables

const { ValidationError, NotFoundError, InternalServerError } = require('../helpers/customErrors');
const logger = require('../config/logger');
const { Consumables, Images } = require('../models');
const { HTTP_STATUS } = require('../config/constants');
const path = require('path');

// Récupérer tous les consommables avec l'image principale
const getConsumables = async (req, res, next) => {
  try {
    const consumables = await Consumables.findAll({
      include: [{
        model: Images,
        as: 'images',
        where: { is_primary: true },
        attributes: ['url'],
        required: false,
      }],
    });

    consumables.forEach(consumable => {
      if (consumable.images.length > 0) {
        consumable.images.forEach(image => {
          // Normalisation du chemin d'accès
          image.url = image.url
            .replace(/\\/g, '/')
            .replace(/ /g, '%20');
        });
        consumable.primary_image = consumable.images[0].url;
      }
    });

    res.status(HTTP_STATUS.OK).json(consumables);
  } catch (error) {
    logger.error(`Erreur lors de la récupération des consommables : ${error.message}`);
    next(new InternalServerError('Erreur serveur'));
  }
};

// Obtenir les détails d'un consommable par ID avec toutes ses images
const getConsumableById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const consumable = await Consumables.findByPk(id, {
      include: [
        {
          model: Images,
          as: 'images',
          attributes: ['url'],
          order: [['is_primary', 'DESC']],
        },
      ],
    });

    if (!consumable) {
      throw new NotFoundError('Consommable non trouvé');
    }

    consumable.images.forEach(img => {
      img.url = img.url
        .replace(/\\/g, '/')
        .replace(/ /g, '%20');
    });

    res.status(HTTP_STATUS.OK).json(consumable);
  } catch (error) {
    logger.error(`Erreur lors de la récupération du consommable : ${error.message}`);
    next(error);
  }
};

// Ajouter un nouveau consommable
const addConsumable = async (req, res, next) => {
  const {
    brand,
    model,
    reference,
    compatible_printer,
    price,
    weight_kg,
    page_capacity,
    size,
    color,
    stock,
  } = req.body;

  try {
    if (!brand || !model || !reference || !price) {
      throw new ValidationError('Les champs obligatoires sont manquants');
    }

    const newConsumable = await Consumables.create({
      brand,
      model,
      reference,
      compatible_printer,
      price,
      weight_kg,
      page_capacity,
      size,
      color,
      stock,
    });

    res.status(HTTP_STATUS.CREATED).json({ message: 'Consommable ajouté avec succès', consumable: newConsumable });
  } catch (error) {
    logger.error(`Erreur lors de l'ajout du consommable : ${error.message}`);
    next(error);
  }
};

// Mettre à jour les informations d'un consommable par ID
const updateConsumable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const consumable = await Consumables.findByPk(id);
    if (!consumable) {
      throw new NotFoundError('Consommable non trouvé');
    }

    await consumable.update(req.body);
    res.status(HTTP_STATUS.OK).json({ message: 'Consommable mis à jour avec succès', consumable });
  } catch (error) {
    logger.error(`Erreur lors de la mise à jour du consommable : ${error.message}`);
    next(error);
  }
};

// Supprimer un consommable par ID
const deleteConsumable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Consumables.destroy({ where: { id_consumable: id } });
    if (result === 0) {
      throw new NotFoundError('Consommable non trouvé');
    }
    res.status(HTTP_STATUS.OK).json({ message: 'Consommable supprimé avec succès' });
  } catch (error) {
    logger.error(`Erreur lors de la suppression du consommable : ${error.message}`);
    next(error);
  }
};

module.exports = {
  getConsumables,
  getConsumableById,
  addConsumable,
  updateConsumable,
  deleteConsumable,
};