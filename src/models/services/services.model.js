const { DataTypes } = require('sequelize');
const { connectionDB } = require('../../config/mysql');

const Services = connectionDB.sequelize.define(
  'Services',
  {
    name_service: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price_service: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    id_company: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_branches: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = Services;
