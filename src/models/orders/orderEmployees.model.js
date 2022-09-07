const { DataTypes } = require('sequelize');
const { connectionDB } = require('../../config/mysql');

const OrdersEmployees = connectionDB.sequelize.define(
  'OrdersEmployees',
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
    id_employee: {
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

module.exports = OrdersEmployees;
