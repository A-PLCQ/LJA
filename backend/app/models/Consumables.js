module.exports = (sequelize, DataTypes) => {
  const Consumables = sequelize.define('Consumables', {
    id_consumable: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [5, 50], // Validation de longueur
      },
    },
    compatible_printer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0, // Assure un prix positif
      },
    },
    weight_kg: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0, // Assure un poids positif
      },
    },
    page_capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, // Au moins 1 page
      },
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0, // Assure que le stock n’est pas négatif
      },
    },
  }, {
    tableName: 'consumables',
    timestamps: true, // Active automatiquement createdAt et updatedAt
    indexes: [
      {
        name: 'idx_consumable_brand_model',
        fields: ['brand', 'model'],
      },
    ],
  });

  return Consumables;
};
