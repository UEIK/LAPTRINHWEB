const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const SubCategory = sequelize.define(
    "SubCategory",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "SUBCATEGORIES",
        freezeTableName: true,
    }
);

module.exports = SubCategory;
