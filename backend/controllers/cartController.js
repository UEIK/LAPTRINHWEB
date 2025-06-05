const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const Gallery = require('../models/Gallery');
const ProductSize = require("../models/ProductSize");

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, color, size } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({ error: "userId, productId, and quantity are required" });
    }

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Tìm hoặc tạo giỏ hàng cho người dùng
    let cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa (dựa trên productId, color, và size)
    let cartItem = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_id: productId,
        color: color || null,
        size: size || null,
      },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cart_id: cart.id,
        product_id: productId,
        quantity,
        color: color || null,
        size: size || null,
      });
    }

    res.status(200).json({ message: "Product added to cart successfully", cartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add product to cart" });
  }
};

// Lấy giỏ hàng của người dùng
const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "price"],
              required: false,
              include: [
                {
                  model: Gallery,
                  attributes: ["thumbnail"],
                },
                {
                  model: ProductSize,
                  as: "Sizes",
                  attributes: ["size"],
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const cartItemsWithStatus = cart.CartItems.map((cartItem) => {
      const productExists = !!cartItem.Product;
      return {
        ...cartItem.toJSON(),
        productExists,
        error: productExists ? null : "Sản phẩm không tồn tại",
      };
    });

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity, size } = req.body;

    console.log(`Updating cart item ${cartItemId}:`, { quantity, size });

    const cartItem = await CartItem.findByPk(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    if (cartItem.quantity < 1) {
      console.log(`Invalid quantity for cart item ${cartItemId}: ${cartItem.quantity}`);
      return res.status(400).json({ error: "Current cart item quantity must be at least 1" });
    }

    if (quantity !== undefined) {
      if (quantity < 1) {
        console.log(`Invalid quantity: ${quantity}`);
        return res.status(400).json({ error: "Quantity must be at least 1" });
      }
      cartItem.quantity = quantity;
    }

    if (size !== undefined) {
      const product = await Product.findByPk(cartItem.product_id, {
        include: [
          {
            model: ProductSize,
            as: "Sizes",
            attributes: ["size"],
          },
        ],
      });

      const availableSizes = product.Sizes?.map((s) => s.size) || [];
      console.log(`Available sizes for product ${cartItem.product_id}:`, availableSizes);
      console.log(`Requested size: ${size}`);

      // Kiểm tra xem đã có CartItem nào với kích thước mới chưa
      const existingItem = await CartItem.findOne({
        where: {
          cart_id: cartItem.cart_id,
          product_id: cartItem.product_id,
          color: cartItem.color,
          size,
        },
      });

      if (existingItem && existingItem.id !== cartItem.id) {
        // Nếu đã có, hợp nhất số lượng
        existingItem.quantity += cartItem.quantity;
        await existingItem.save();
        await cartItem.destroy();
        return res.status(200).json({ message: "Cart item merged with existing item", cartItem: existingItem });
      }

      cartItem.size = size;
    }

    await cartItem.save();

    res.status(200).json({ message: "Cart item updated successfully", cartItem });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const cartItem = await CartItem.findByPk(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await cartItem.destroy();

    res.status(200).json({ message: "Cart item removed successfully" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ error: "Failed to remove cart item" });
  }
};

module.exports = { addToCart, getCart, updateCartItem, removeCartItem };