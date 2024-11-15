module.exports = (sequelize, DataTypes) => {
  const CompatiblePrinters = sequelize.define('CompatiblePrinters', {
    id_consumable: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Consumables',
        key: 'id_consumable',
      },
      allowNull: false,
    },
    id_printer: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Printers',
        key: 'id_printer',
      },
      allowNull: false,
    },
  }, {
    tableName: 'compatible_printers',
    timestamps: false, // Pas de suivi des modifications
    indexes: [
      {
        name: 'idx_compatible_printers',
        fields: ['id_printer', 'id_consumable'],
        unique: true, // Garantit qu'une imprimante et un consommable ne peuvent pas être dupliqués
      },
    ],
  });
  
  return CompatiblePrinters;
};
