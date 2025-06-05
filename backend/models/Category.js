const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "CATEGORIES",
    freezeTableName: true,
  }
);

module.exports = Category;
