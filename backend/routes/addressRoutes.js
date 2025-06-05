const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
// const authMiddleware = require("../middleware/authMiddleware"); // <-- Thêm dòng này
const { authenticate } = require("../middleware/authMiddleware");



router.post("/", addressController.createAddress);
router.get("/:userId", addressController.getAddressesByUserId);
// router.delete("/:id", authMiddleware, addressController.deleteAddress);
router.delete("/:id", authenticate, addressController.deleteAddress);
module.exports = router;
