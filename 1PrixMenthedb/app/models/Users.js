// Users.js - Définition du modèle en tant que fonction
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id_utilisateur: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    mot_de_passe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    adresse: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('user', 'manager', 'admin'),
      defaultValue: 'user',
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reset_code: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    reset_code_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'users',
    timestamps: false,
  });

  return Users;
};
