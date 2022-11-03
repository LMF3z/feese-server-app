const { DataTypes } = require('sequelize');
const { connectionDB } = require('../../config/mysql');

const Products_orders = connectionDB.sequelize.define(
  'products_orders',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    num_control: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount_product: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    current_price_product: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    // * amount_product por current_price_product
    total_payment: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    state_null: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { timestamps: true }
);

module.exports = Products_orders;
