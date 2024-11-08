// Centralized module export format for OrderItems model
module.exports = (sequelize, DataTypes) => {
  const OrderItems = sequelize.define('OrderItems', {
    id_commande: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Orders',
        key: 'id_commande',
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
      allowNull: true,
      onDelete: 'CASCADE',
    },
    id_consumable: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Consumables',
        key: 'id_consumable',
      },
      allowNull: true,
      onDelete: 'CASCADE',
    },
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'order_items',
    timestamps: false,
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
