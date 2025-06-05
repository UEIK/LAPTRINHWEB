const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ code: 403, message: "Không có quyền truy cập!" });
        }

        const token = authHeader.split(" ")[1]; // Lấy token sau 'Bearer '
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // Gán user vào req để sử dụng sau này
        next(); // Cho phép request tiếp tục
    } catch (err) {
        return res.status(401).json({ code: 401, message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};

module.exports = verifyToken;
