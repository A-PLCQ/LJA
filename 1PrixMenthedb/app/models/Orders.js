module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define('Orders', {
    id_commande: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { // Mise à jour ici pour correspondre à la clé primaire de Users
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    montant_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM('en attente', 'confirmé', 'livré', 'annulé'),
      allowNull: false,
      defaultValue: 'en attente',
    },
    adresse_livraison: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [10, 255],
      },
    },
  }, {
    tableName: 'orders',
    timestamps: true,
  });
  
  return Orders;
};
