const { Address } = require("../models/AssociationsRelationship");

exports.createAddress = async (req, res) => {
  try {
    const { user_id, address, firstname, lastname, phone } = req.body;

    console.log("Received address data:", req.body); // debug log

    const data = await Address.create({
      user_id,
      address,
      firstname,
      lastname,
      phone,
    });

    res.status(201).json({ message: "Address created", data });
  } catch (err) {
    console.error("❌ Error creating address:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAddressesByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const data = await Address.findAll({ where: { user_id: userId } });
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Error fetching addresses:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await Address.destroy({ where: { id } });

    if (deleted === 0) {
      // Không có địa chỉ nào khớp
      return res.status(404).json({ error: "Address not found" });
    }

    res.status(200).json({ message: "Đã xoá địa chỉ" });
  } catch (err) {
    console.error("❌ Error deleting address:", err);
    res.status(500).json({ error: "Xoá thất bại", detail: err.message });
  }
};

