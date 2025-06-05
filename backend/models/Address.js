const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Address = sequelize.define(
  "Address",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(510),
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: "firstname",
    },
    lastname: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: "lastname",
    },
    phone: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE(6), // ✅ Sửa lại
      field: "created_at",
    },
    updated_at: {
      type: DataTypes.DATE(6), // ✅ Sửa lại
      field: "updated_at",
    },
  },
  {
    tableName: "ADDRESS",
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Address;
