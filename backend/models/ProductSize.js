const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const ProductSize = sequelize.define(
    "ProductSize",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        size: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "PRODUCT_SIZE",
        freezeTableName: true,
    }
);

module.exports = ProductSize;