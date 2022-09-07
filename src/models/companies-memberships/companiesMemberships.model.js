const { DataTypes } = require('sequelize');
const { connectionDB } = require('../../config/mysql');

const CompaniesMemberships = connectionDB.sequelize.define(
  'CompaniesMemberships',
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
    state_payment: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'procesando',
    },
    reference_transfer: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount_payment_membership: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dollar_value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = CompaniesMemberships;
