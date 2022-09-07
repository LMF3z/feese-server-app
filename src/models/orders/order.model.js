const { DataTypes } = require('sequelize');
const { connectionDB } = require('../../config/mysql');

const Orders = connectionDB.sequelize.define(
  'Orders',
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    num_control: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_payment: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    client_selected: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cash: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    card: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    transfer: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    cashChange: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    state_null: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hour: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Orders;
