// Centralized module export format for CompatiblePrinters model
module.exports = (sequelize, DataTypes) => {
  const CompatiblePrinters = sequelize.define('CompatiblePrinters', {
    id_consumable: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Consumables',
        key: 'id_consumable',
      },
      allowNull: false,
      onDelete: 'CASCADE',
    },
    id_printer: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Printers',
        key: 'id_printer',
      },
      allowNull: false,
      onDelete: 'CASCADE',
    },
  }, {
    tableName: 'compatible_printers',
    timestamps: false,
    indexes: [
      {
        name: 'idx_compatible_printers',
        fields: ['id_printer', 'id_consumable'],
      },
    ],
  });

  return CompatiblePrinters;
};
