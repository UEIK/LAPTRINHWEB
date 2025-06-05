const express = require("express");
const router = express.Router();
const { authenticate, authorizeAdmin } = require("../middleware/authMiddleware");
const { getUsers, getUserById, updateUser, deleteUser } = require("../controllers/adminController");

// Chặn bằng middleware authenticate + authorizeAdmin
router.get("/users", authenticate, authorizeAdmin, getUsers);
router.get("/users/:id", authenticate, authorizeAdmin, getUserById);
router.put("/users/:id", authenticate, authorizeAdmin, updateUser);
router.delete("/users/:id", authenticate, authorizeAdmin, deleteUser);

module.exports = router;