const jwt = require("jsonwebtoken");
const { User } = require("../models/User"); // Có thể bỏ nếu không dùng truy DB
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// ✅ Middleware kiểm tra đăng nhập
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Không có token", code: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // Lưu thông tin user vào req để dùng ở bước sau
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role_id: decoded.role_id, // 👈 quan trọng để phân quyền
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ", code: 401 });
  }
};

// ✅ Middleware kiểm tra quyền admin (role_id = 2)
const authorizeAdmin = (req, res, next) => {
  if (req.user?.role_id !== 2) {
    return res.status(403).json({ message: "Chỉ admin được phép truy cập", code: 403 });
  }
  next();
};

module.exports = {
  authenticate,
  authorizeAdmin,
};
