const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const CartItem = sequelize.define(
    "CartItem",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        cart_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        color: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        size: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
    },
    {
        timestamps: false,
        tableName: "CART_ITEM",
        freezeTableName: true,
    }
);

module.exports = CartItem;