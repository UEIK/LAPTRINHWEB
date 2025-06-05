const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

module.exports = {
  // ĐĂNG KÝ
  registerService: async ({ name, email, password }) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return { code: 400, message: "Email đã tồn tại" };
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role_id: 1 // ✅ Mặc định là "user"
    });
  
    return {
      message: "Đăng ký thành công",
      code: 201,
      data: {
        id: newUser.id,
        username: newUser.name,
        email: newUser.email
      }
    };
  },
  

  // ĐĂNG NHẬP
  loginService: async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return { code: 400, message: "Email không tồn tại" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { code: 400, message: "Sai mật khẩu" };
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role_id: user.role_id  // 👉 THÊM VÀO TOKEN
    },
    process.env.JWT_SECRET || "your_secret_key",
    { expiresIn: "1d" }
  );

  return {
    message: "Đăng nhập thành công",
    code: 200,
    data: {
      id: user.id,
      username: user.name,
      email: user.email,
      role_id: user.role_id // 👉 Gửi luôn cho frontend nếu cần
    },
    token
  };
}

};
