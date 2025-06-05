const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

// Đăng ký tài khoản mới
router.post("/register", loginController.register);

// Đăng nhập
router.post("/login", loginController.login);

// Lấy thông tin người dùng từ token
router.get("/me", loginController.getUser);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const loginController = require("../controllers/loginController"); // Đảm bảo file này tồn tại và có export login

// router.post("/", loginController.login); // ✅ dùng POST
// // router.post("/register", loginController.register);

// module.exports = router;
