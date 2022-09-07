const { DataTypes } = require('sequelize');
const { connectionDB } = require('../../config/mysql');

const Clients = connectionDB.sequelize.define(
  'Clients',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    id_company: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_branches: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    name_client: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name_client: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    identification_client: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    phone_client: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Clients;
