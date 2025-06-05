const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    subcategory_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false, // Không sử dụng createdAt, updatedAt
    tableName: "PRODUCT", // Đúng tên bảng trong SQL Server
    freezeTableName: true, // Không tự đổi tên bảng
  }
);

module.exports = Product;
