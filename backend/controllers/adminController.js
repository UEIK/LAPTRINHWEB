const User = require("../models/User");

// ✅ Lấy danh sách tất cả tài khoản
const getUsers = async (req, res) => {
  try {
    // Lấy page, limit từ query, mặc định page=1, limit=15
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    // Truy vấn theo phân trang
    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      order: [['id', 'ASC']],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      message: "Lấy danh sách tài khoản thành công",
      code: 200,
      data: rows,
      totalPages,
      currentPage: page,
      totalUsers: count,
    });
  } catch (error) {
    console.error("🚀 ~ getUsers error:", error);
    return res.status(500).json({
      message: "Lỗi server",
      code: 500,
      data: null
    });
  }
};


// ✅ Lấy chi tiết một tài khoản
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
        code: 404,
        data: null
      });
    }

    return res.status(200).json({
      message: "Lấy thông tin người dùng thành công",
      code: 200,
      data: user
    });

  } catch (error) {
    console.error("🚀 ~ getUserById error:", error);
    return res.status(500).json({
      message: "Lỗi server",
      code: 500,
      data: null
    });
  }
};

// ✅ Cập nhật tài khoản (chỉ sửa name + role_id)
const updateUser = async (req, res) => {
  try {
    const { name, role_id } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
        code: 404,
        data: null
      });
    }

    // Chỉ update name và role_id
    user.name = name || user.name;
    user.role_id = role_id !== undefined ? role_id : user.role_id;

    await user.save();

    return res.status(200).json({
      message: "Cập nhật tài khoản thành công",
      code: 200,
      data: {
        id: user.id,
        name: user.name,
        role_id: user.role_id
      }
    });

  } catch (error) {
    console.error("🚀 ~ updateUser error:", error);
    return res.status(500).json({
      message: "Lỗi server",
      code: 500,
      data: null
    });
  }
};

// ✅ Xoá tài khoản
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
        code: 404,
        data: null
      });
    }

    await user.destroy();

    return res.status(200).json({
      message: "Xóa tài khoản thành công",
      code: 200,
      data: { id: user.id }
    });

  } catch (error) {
    console.error("🚀 ~ deleteUser error:", error);
    return res.status(500).json({
      message: "Lỗi server",
      code: 500,
      data: null
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};