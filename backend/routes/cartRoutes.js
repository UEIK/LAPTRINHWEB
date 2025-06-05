const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/add", authenticate, cartController.addToCart);
router.get("/:userId", authenticate, cartController.getCart);
router.put("/item/:cartItemId", authenticate, cartController.updateCartItem);
router.delete("/item/:cartItemId", authenticate, cartController.removeCartItem);

module.exports = router;