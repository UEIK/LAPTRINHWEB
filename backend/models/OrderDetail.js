const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const OrderDetail = sequelize.define(
  "OrderDetail",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    total_money: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      get() {
        const quantity = this.getDataValue("quantity") || 0;
        const price = this.getDataValue("price") || 0;
        return price * quantity;
      },
      set() {
        // Không cho phép set giá trị này vì nó là computed column trong SQL Server
        throw new Error("Cannot set value of computed column 'total_money'");
      },
    },
  },
  {
    timestamps: false,
    tableName: "ORDER_DETAIL",
    freezeTableName: true,
  }
);

module.exports = OrderDetail;
