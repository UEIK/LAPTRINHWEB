const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    total_money: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
  },
  {
    timestamps: false, // Không có createdAt / updatedAt
    tableName: "ORDER", // Giữ nguyên tên bảng SQL Server
    freezeTableName: true, // Không đổi tên bảng thành "Orders"
  }
);

module.exports = Order;
