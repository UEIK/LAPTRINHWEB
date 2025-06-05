const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "your_secret_key"; // 👉 Nên lưu trong .env

// Đăng ký tài khoản
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    console.log(existingUser);
    if (existingUser) {
      return res.status(400).json({ code: 400, message: "Tài khoản đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: username, // ✅ map đúng với model
      email,
      password: hashedPassword,
      role_id: 1,
    });

    res.status(201).json({
      code: 201,
      message: "Đăng ký thành công",
      data: {
        id: newUser.id,
        username: newUser.name, // ✅ trả về đúng biến
        email: newUser.email,
        role_id: newUser.role_id,
      },
    });
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    res.status(500).json({ code: 500, message: "Lỗi server khi đăng ký", data: null });
  }
};

// Đăng nhập
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ code: 404, message: "Tài khoản không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ code: 401, message: "Sai mật khẩu" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role_id: user.role_id, // 👈 Thêm vào token
      },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      code: 200,
      message: "Đăng nhập thành công",
      token,
      data: {
        id: user.id,
        username: user.name,
        email: user.email,
        role_id: user.role_id, // 👈 Thêm vào FE luôn
      },
    });

  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    res.status(500).json({ code: 500, message: "Lỗi server khi đăng nhập", data: null });
  }
};

// Lấy thông tin người dùng từ token
const getUser = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ code: 401, message: "Không có token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ code: 404, message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({
      code: 200,
      message: "Lấy thông tin người dùng thành công",
      data: {
        id: user.id,
        username: user.name, // ✅ đổi thành name
        email: user.email,
      },
    });
  } catch (err) {
    res.status(401).json({ code: 401, message: "Token không hợp lệ" });
  }
};

module.exports = { register, login, getUser };
