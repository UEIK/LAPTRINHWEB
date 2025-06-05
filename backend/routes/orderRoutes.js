const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/details/:orderId", orderController.getOrderDetails);
router.post("/", orderController.placeOrder); // xử lý POST /api/order
router.get("/admin", orderController.getAllOrders);
router.put('/:id/status', orderController.updateOrderStatus);


module.exports = router;