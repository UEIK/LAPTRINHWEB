const authService = require('../services/authService');

// ✅ ĐĂNG KÝ
const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("🔥 BODY:", req.body);

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc!", code: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email không hợp lệ!", code: 400 });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!", code: 400 });
        }

        const data = await authService.registerService({ name, email, password });

        return res.status(data.code).json({
            message: data.message,
            code: data.code,
            data: data.data,
        });

    } catch (err) {
        console.error("🚀 ~ registerController ~ err:", err);
        return res.status(500).json({
            message: 'Lỗi từ hệ thống',
            code: 500,
            data: null,
        });
    }
};

// ✅ ĐĂNG NHẬP
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Thiếu email hoặc mật khẩu!", code: 400 });
        }

        const data = await authService.loginService({ email, password });

        return res.status(data.code).json({
            message: data.message,
            code: data.code,
            data: data.data,
            token: data.token,
        });

    } catch (err) {
        console.error("🚀 ~ loginController ~ err:", err);
        return res.status(500).json({
            message: 'Lỗi từ hệ thống',
            code: 500,
            data: null,
        });
    }
};

module.exports = {
    registerController,
    loginController,
};
