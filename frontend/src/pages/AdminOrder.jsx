import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminSidebar from "../components/sidebar";
import "../styles/AdminOrder.css";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";
import moment from "moment";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;


  const fetchOrders = async (page = 1) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3030/api/order/admin?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrders(res.data.data);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    } catch (err) {
      console.error("❌ Lỗi khi lấy đơn hàng:", err);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Gọi API cập nhật trạng thái (bạn cần tạo API này)
      await axios.put(`http://localhost:3030/api/order/${orderId}/status`, { status: newStatus });

      // Cập nhật state orders để UI cập nhật ngay
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("❌ Lỗi cập nhật trạng thái:", error);
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar active="ORDER" />

      <div className="admin-content">
        <div className="admin-header">
          <span className="admin-icon">🏷️</span>
          <div>
            <h2>ORDER</h2>
            <p>view, create, update, delete and manage.</p>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>CODE</th>
              <th>ADDRESS</th>
              <th>TOTAL</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id} className={index % 2 === 1 ? "even" : ""}>
                <td>{moment(order.order_date).format('YYYY-MM-DD HH:mm:ss')}</td>
                <td style={{ color: "#999", fontStyle: "italic" }}>
                  #{`ORD${order.id}${String.fromCharCode(97 + (order.id % 26))}`}
                </td>
                <td>{order.address}</td>
                <td>{order.total_money}$</td>
                <td>
                  <select
                    className="custom-select"
                    value={order.status || "Processing"}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipping">Shipping</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancle">Cancel</option>
                  </select>
                </td>
                <td>
                  <Link to={`/admin/order/${order.id}`} className="order-link">
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-admin">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            < GrFormPrevious size={20} />
          </button>

          <span>Page {currentPage} of {totalPages}</span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            < GrFormNext size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrder;