module.exports = (sequelize, DataTypes) => {
  const OrderItems = sequelize.define('OrderItems', {
    id_commande: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Orders',
        key: 'id_commande',
      },
      allowNull: false,
    },
    id_printer: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Printers',
        key: 'id_printer',
      },
      allowNull: true,
    },
    id_consumable: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Consumables',
        key: 'id_consumable',
      },
      allowNull: true,
    },
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, // Validation pour éviter une quantité inférieure à 1
      },
    },
  }, {
    tableName: 'order_items',
    timestamps: false,
    indexes: [
      {
        name: 'idx_id_commande',
        fields: ['id_commande'],
      },
      {
        name: 'idx_id_printer',
        fields: ['id_printer'],
      },
      {
        name: 'idx_id_consumable',
        fields: ['id_consumable'],
      },
    ],
    validate: {
      eitherPrinterOrConsumable() {
        if ((this.id_printer && this.id_consumable) || (!this.id_printer && !this.id_consumable)) {
          throw new Error('Either id_printer or id_consumable must be set, but not both.');
        }
      },
    },
  });

  return OrderItems;
};
