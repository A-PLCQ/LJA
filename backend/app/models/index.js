const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

// Importation des modèles
const UsersModel = require('./Users');
const PrintersModel = require('./Printers');
const ConsumablesModel = require('./Consumables');
const CartItemsModel = require('./CartItems');
const CompatiblePrintersModel = require('./CompatiblePrinters');
const ImagesModel = require('./Images');
const OrdersModel = require('./Orders');
const OrderItemsModel = require('./OrderItems');
const PaymentsModel = require('./Payments');
const RefreshTokensModel = require('./RefreshTokens');

// Initialisation des modèles
const Users = UsersModel(sequelize, DataTypes);
const Printers = PrintersModel(sequelize, DataTypes);
const Consumables = ConsumablesModel(sequelize, DataTypes);
const CartItems = CartItemsModel(sequelize, DataTypes);
const CompatiblePrinters = CompatiblePrintersModel(sequelize, DataTypes);
const Images = ImagesModel(sequelize, DataTypes);
const Orders = OrdersModel(sequelize, DataTypes);
const OrderItems = OrderItemsModel(sequelize, DataTypes);
const Payments = PaymentsModel(sequelize, DataTypes);
const RefreshTokens = RefreshTokensModel(sequelize, DataTypes);

// === Associations === //
Users.hasMany(Orders, { foreignKey: 'user_id', as: 'orders' });
Orders.belongsTo(Users, { foreignKey: 'user_id', as: 'user' });

Users.hasMany(RefreshTokens, { foreignKey: 'user_id', as: 'tokens' });
RefreshTokens.belongsTo(Users, { foreignKey: 'user_id', as: 'user' });

Users.hasMany(CartItems, { foreignKey: 'user_id', as: 'cartItems' });
CartItems.belongsTo(Users, { foreignKey: 'user_id', as: 'user' });

Printers.hasMany(Images, { foreignKey: 'id_printer', as: 'images' }); 
Images.belongsTo(Printers, { foreignKey: 'id_printer', as: 'images' }); 

Printers.hasMany(CartItems, { foreignKey: 'id_printer', as: 'cartItems' });
CartItems.belongsTo(Printers, { foreignKey: 'id_printer', as: 'printer' });

Printers.belongsToMany(Consumables, {
  through: CompatiblePrinters,
  foreignKey: 'id_printer',
  otherKey: 'id_consumable',
  as: 'compatibleConsumables',
});

Consumables.belongsToMany(Printers, {
  through: CompatiblePrinters,
  foreignKey: 'id_consumable',
  otherKey: 'id_printer',
  as: 'compatiblePrinters',
});

Consumables.hasMany(CartItems, { foreignKey: 'id_consumable', as: 'cartItems' });
CartItems.belongsTo(Consumables, { foreignKey: 'id_consumable', as: 'consumable' });

Consumables.hasMany(Images, { foreignKey: 'id_consumable', as: 'images' });
Images.belongsTo(Consumables, { foreignKey: 'id_consumable', as: 'consumable' });

Orders.hasMany(OrderItems, { foreignKey: 'id_commande', as: 'items' });
OrderItems.belongsTo(Orders, { foreignKey: 'id_commande', as: 'order' });

Orders.hasMany(Payments, { foreignKey: 'id_commande', as: 'payments' });
Payments.belongsTo(Orders, { foreignKey: 'id_commande', as: 'order' });

// === Initialisation des modèles dans l'ordre === //
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');

    // Synchronisation séquentielle
    await Users.sync();
    console.log('Table Users synchronisée.');

    await Printers.sync();
    console.log('Table Printers synchronisée.');

    await Consumables.sync();
    console.log('Table Consumables synchronisée.');

    await CompatiblePrinters.sync();
    console.log('Table CompatiblePrinters synchronisée.');

    await Orders.sync();
    console.log('Table Orders synchronisée.');

    await CartItems.sync();
    console.log('Table CartItems synchronisée.');

    await OrderItems.sync();
    console.log('Table OrderItems synchronisée.');

    await Payments.sync();
    console.log('Table Payments synchronisée.');

    await RefreshTokens.sync();
    console.log('Table RefreshTokens synchronisée.');

    await Images.sync();
    console.log('Table Images synchronisée.');

    console.log('Synchronisation des modèles réussie.');
  } catch (error) {
    console.error('Erreur lors de la synchronisation avec la base de données :', error);
  }
};

initializeDatabase();

module.exports = {
  sequelize,
  Users,
  Printers,
  Consumables,
  CartItems,
  CompatiblePrinters,
  Images,
  Orders,
  OrderItems,
  Payments,
  RefreshTokens,
};
