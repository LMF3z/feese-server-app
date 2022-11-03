const { DataTypes } = require('sequelize');
const { connectionDB } = require('../../config/mysql');

const Products = connectionDB.sequelize.define(
  'Products',
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
    id_branch: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_enable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    // createdAt: {
    //   type: DataTypes.DATEONLY,
    //   allowNull: false,
    // },
    // updatedAt: {
    //   type: DataTypes.DATEONLY,
    //   allowNull: false,
    // },
  },
  { timestamps: true }
);

module.exports = Products;
