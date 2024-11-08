// Import Sequelize and initialize the connection instance
const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

// Initialisation des modèles en utilisant sequelize et DataTypes
const UserModel = require('./Users');
const CartItemsModel = require('./CartItems');
const CompatiblePrintersModel = require('./CompatiblePrinters');
const ConsumablesModel = require('./Consumables');
const ImagesModel = require('./Images');
const OrderItemsModel = require('./OrderItems');
const OrdersModel = require('./Orders');
const PaymentsModel = require('./Payments');
const PrintersModel = require('./Printers');
const RefreshTokensModel = require('./RefreshTokens');

// Initialisation de chaque modèle avec sequelize et DataTypes
const User = UserModel(sequelize, DataTypes);
const CartItems = CartItemsModel(sequelize, DataTypes);
const CompatiblePrinters = CompatiblePrintersModel(sequelize, DataTypes);
const Consumables = ConsumablesModel(sequelize, DataTypes);
const Images = ImagesModel(sequelize, DataTypes);
const OrderItems = OrderItemsModel(sequelize, DataTypes);
const Orders = OrdersModel(sequelize, DataTypes);
const Payments = PaymentsModel(sequelize, DataTypes);
const Printers = PrintersModel(sequelize, DataTypes);
const RefreshTokens = RefreshTokensModel(sequelize, DataTypes);

// Définir les associations entre les modèles

// User - Orders
User.hasMany(Orders, { onDelete: 'CASCADE' });
Orders.belongsTo(User);

// User - CartItems
User.hasMany(CartItems, { onDelete: 'CASCADE' });
CartItems.belongsTo(User);

// CartItems - Printers & Consumables
Printers.hasMany(CartItems, { onDelete: 'CASCADE' });
CartItems.belongsTo(Printers);

Consumables.hasMany(CartItems, { onDelete: 'CASCADE' });
CartItems.belongsTo(Consumables);

// Orders - OrderItems
Orders.hasMany(OrderItems, { onDelete: 'CASCADE' });
OrderItems.belongsTo(Orders);

// Printers - CompatiblePrinters
Printers.hasMany(CompatiblePrinters, { onDelete: 'CASCADE' });
CompatiblePrinters.belongsTo(Printers);

Consumables.hasMany(CompatiblePrinters, { onDelete: 'CASCADE' });
CompatiblePrinters.belongsTo(Consumables);

// Orders - Payments
Orders.hasMany(Payments, { onDelete: 'CASCADE' });
Payments.belongsTo(Orders);

// RefreshTokens - User
User.hasMany(RefreshTokens, { onDelete: 'CASCADE' });
RefreshTokens.belongsTo(User);

// Exports des modèles et de l'instance sequelize
module.exports = {
  User,
  CartItems,
  CompatiblePrinters,
  Consumables,
  Images,
  OrderItems,
  Orders,
  Payments,
  Printers,
  RefreshTokens,
  sequelize,
};
