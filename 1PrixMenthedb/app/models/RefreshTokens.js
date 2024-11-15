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
      validate: {
        len: [32, 512], // Longueur minimale et maximale pour le token
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id', // Aligné avec la clé primaire `id` du modèle Users
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
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
      validate: {
        isIP: true, // Valide uniquement les adresses IP valides (IPv4/IPv6)
      },
    },
    device_info: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'refresh_tokens',
    timestamps: true, // Sequelize gère automatiquement createdAt et updatedAt
    indexes: [
      {
        name: 'idx_user_id_tokens',
        fields: ['user_id'],
      },
    ],
  });
  
  return RefreshTokens;
};
