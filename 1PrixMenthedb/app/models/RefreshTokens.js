// RefreshTokens.js - Définition du modèle en tant que fonction
module.exports = (sequelize, DataTypes) => {
  const RefreshTokens = sequelize.define('RefreshTokens', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Utiliser le nom du modèle sous forme de chaîne de caractères pour éviter la dépendance circulaire
        key: 'id_utilisateur',
      },
      onDelete: 'CASCADE',
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_revoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true, 
    },
    device_info: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'refresh_tokens',
    timestamps: false,
    indexes: [
      {
        name: 'idx_id_utilisateur_tokens',
        fields: ['user_id'],
      },
    ],
  });

  return RefreshTokens;
};
