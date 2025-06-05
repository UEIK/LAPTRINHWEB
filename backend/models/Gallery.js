const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Gallery = sequelize.define(
  "Gallery",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "GALLERY",
    freezeTableName: true,
  }
);

module.exports = Gallery;
