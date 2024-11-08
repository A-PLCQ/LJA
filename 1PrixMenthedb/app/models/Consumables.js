// Centralized module export format for Consumables model
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
    },
    compatible_printer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    weight_kg: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    page_capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    },
  }, {
    tableName: 'consumables',
    timestamps: false,
    indexes: [
      {
        name: 'idx_consumable_brand_model',
        fields: ['brand', 'model'],
      },
    ],
  });

  return Consumables;
};