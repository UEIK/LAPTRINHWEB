const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Cart = sequelize.define(
    "Cart",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true, // Đảm bảo mỗi user chỉ có một giỏ hàng
        },
    },
    {
        timestamps: false,
        tableName: "CART",
        freezeTableName: true,
    }
);

module.exports = Cart;