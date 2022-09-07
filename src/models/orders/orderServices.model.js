const { DataTypes } = require('sequelize');
const { connectionDB } = require('../../config/mysql');

const OrdersServices = connectionDB.sequelize.define(
  'OrdersServices',
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
    id_service: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    num_control: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = OrdersServices;
