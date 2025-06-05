const { Order, OrderDetail, Product, Gallery, Cart, CartItem } = require("../models/AssociationsRelationship");
const { Op } = require("sequelize");
const moment = require("moment");

// 🧾 Tạo đơn hàng (Checkout)
exports.placeOrder = async (req, res) => {
  try {
    const {
      user_id,
      name,
      email,
      phone_number,
      address,
      note,
      total_money,
      items,
    } = req.body;

    // ✅ Format ngày theo chuẩn SQL Server
    const orderDate = moment().utcOffset(0).format("YYYY-MM-DD HH:mm:ss");
    console.log("🕒 Ngày order format:", orderDate);

    // 📝 Tạo đơn hàng
    const order = await Order.create({
      user_id,
      name,
      email,
      phone_number,
      address,
      note,
      order_date: orderDate,
      status: "Processing",
      total_money,
    });

    // 🧾 Tạo chi tiết đơn hàng
    const orderDetails = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
    }));
    await OrderDetail.bulkCreate(orderDetails);

    // ✅ XÓA CÁC SẢN PHẨM ĐÃ ĐẶT KHỎI GIỎ HÀNG
    const userCart = await Cart.findOne({ where: { user_id } });

    if (userCart) {
      const productIds = items.map(item => item.product_id);

      await CartItem.destroy({
        where: {
          cart_id: userCart.id,
          product_id: {
            [Op.in]: productIds
          }
        }
      });
    }

    return res.status(201).json({ message: "Đặt hàng thành công!" });
  } catch (error) {
    console.error("❌ Lỗi đặt hàng:", error);
    return res.status(500).json({ error: "Lỗi máy chủ", detail: error.message });
  }
};

// 📦 API lấy tất cả đơn hàng cho admin
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const { count, rows } = await Order.findAndCountAll({
      order: [["id", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      code: 200,
      message: "Lấy danh sách đơn hàng thành công",
      data: rows,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách đơn hàng:", error);
    return res.status(500).json({ error: "Lỗi máy chủ", detail: error.message });
  }
};


// 📋 Chi tiết đơn hàng
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const details = await OrderDetail.findAll({
      where: { order_id: orderId },
      include: [
        {
          model: Product,
          as: "Product",
          attributes: ["name"],
          include: [
            {
              model: Gallery,
              as: "Galleries",
              attributes: ["thumbnail"],
              required: false,
            },
          ],
        },
        {
          model: Order,
          as: "Order",
          attributes: ["address", "name", "phone_number"],
        }
      ],
    });

    const data = details.map((d) => ({
      id: d.id,
      name: d.Product?.name,
      image: d.Product?.Galleries?.[0]?.thumbnail || "",
      quantity: d.quantity,
      price: d.price,
      size: d.size,
      address: d.Order?.address,
      name: d.Order?.name,
      phone_number: d.Order?.phone_number,
    }));

    res.json({ data });
  } catch (error) {
    console.error("Lỗi lấy chi tiết đơn hàng:", error);
    res.status(500).json({ error: "Lỗi máy chủ", detail: error.message, stack: error.stack });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated', status: order.status });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

