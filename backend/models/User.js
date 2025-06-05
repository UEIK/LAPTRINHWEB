const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");


const User = sequelize.define(
  "User",
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
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // ✅ Mặc định là user
    }
  },
  {
    timestamps: false, // Không tạo createdAt, updatedAt
    tableName: "USER", // Đúng tên bảng trong SQL Server
    freezeTableName: true, // Không đổi tên thành Users
  }
);

module.exports = User;
