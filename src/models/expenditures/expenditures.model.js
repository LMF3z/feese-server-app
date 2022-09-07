const { DataTypes } = require('sequelize');
const { connectionDB } = require('../../config/mysql');

const Expenditures = connectionDB.sequelize.define(
  'Expenditures',
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
    description_expenditure: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount_article: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cost_expenditure: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
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
  { timestamps: true }
);

module.exports = Expenditures;
