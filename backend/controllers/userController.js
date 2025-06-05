// const userService = require('../services/userService');

// const getProfileController = async (req, res) => {
//     try {

//         let data = await userService.getProfileService(req.user)

//         return res.status(data.code).json({
//             message: data.message,
//             code: data.code,
//             data: data.data
//         })

//     } catch (err) {
//         console.log("🚀 ~ getProfileController ~ err:", err)
//         return res.status(500).json({
//             message: 'Lỗi từ hệ thống',
//             code: 500,
//             data: ''
//         })
//     }
// }

// const getAllUsersController = async (req, res) => {
//     try {
//         let data = await userService.getAllUsersService();

//         return res.status(data.code).json({
//             message: data.message,
//             code: data.code,
//             data: data.data
//         })

//     } catch (err) {
//         console.log("🚀 ~ getAllUsersController ~ err:", err)
//         return res.status(500).json({
//             message: 'Lỗi từ hệ thống',
//             code: 500,
//             data: ''
//         })
//     }
// }

// const updateUserStatusController = async (req, res) => {
//     try {
//         let { id } = req.params; // Lấy ID từ params
//         let { status } = req.body; // Lấy status từ body

//         // Kiểm tra status hợp lệ
//         let data = await userService.updateUserStatusService(id, status);
//         return res.status(data.code).json({
//             message: data.message,
//             code: data.code,
//             data: ""
//         })

//     } catch (error) {
//         console.log("🚀 ~ updateUserStatusController ~ err:", err)
//         return res.status(500).json({
//             message: 'Lỗi từ hệ thống',
//             code: 500,
//             data: ''
//         })
//     }
// };

// const detailUserAndHistoryOrderController = async (req, res) => {
//     try {

//         const { userId } = req.params;

//         let data = await userService.detailUserAndHistoryOrderService(userId);
//         return res.status(data.code).json({
//             message: data.message,
//             code: data.code,
//             data: data.data
//         })

//     } catch (error) {
//         console.log("🚀 ~ detailUserAndHistoryOrderController ~ err:", err)
//         return res.status(500).json({
//             message: 'Lỗi từ hệ thống',
//             code: 500,
//             data: ''
//         })
//     }
// }

// const searchUserByNameAndPhoneController = async (req, res) => {
//     try {

//         const { keyword } = req.query; // Lấy keyword từ query string
//         if (!keyword) {
//             return res.status(400).json({ code: 400, message: "Thiếu từ khóa tìm kiếm!" });
//         }
//         const data = await userService.searchUserByNameAndPhoneService(keyword);
//         return res.status(data.code).json({
//             message: data.message,
//             code: data.code,
//             data: data.data
//         })

//     } catch (error) {
//         console.log("🚀 ~ searchUserByNameAndPhoneController ~ err:", err)
//         return res.status(500).json({
//             message: 'Lỗi từ hệ thống',
//             code: 500,
//             data: ''
//         })
//     }
// }
// const updateUserAddressController = async (req, res) => {
//     try {
//         const { userId, address } = req.body;
//         console.log("🚀 ~ updateUserAddressController ~ userId, address :", userId, address )

//         if (!userId || !address) {
//             return res.status(400).json({ message: "Thiếu thông tin." });
//         }
//         const data = await userService.updateUserAddressService(userId, address);
//         return res.status(data.code).json({
//             message: data.message,
//             code: data.code,
//             data: data.data
//         })

//     } catch (error) {
//         console.log("🚀 ~ updateUserAddressController ~ err:", err)
//         return res.status(500).json({
//             message: 'Lỗi từ hệ thống',
//             code: 500,
//             data: ''
//         })
//     }
// }
// module.exports = {
//     getProfileController, getAllUsersController, updateUserStatusController, detailUserAndHistoryOrderController, searchUserByNameAndPhoneController,
//     updateUserAddressController
// };
