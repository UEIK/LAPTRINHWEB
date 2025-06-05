import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/AdminOrderDetail.css";
import Sidebar from "../components/sidebar";

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const [details, setDetails] = useState([]);
  const [orderInfo, setOrderInfo] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:3030/api/order/details/${orderId}`)

      .then((res) => {
        console.log("✅ Dữ liệu nhận được:", res.data.data);
        setDetails(res.data.data)
        setOrderInfo({
          address: res.data.data[0]?.address,
          name: res.data.data[0]?.name,
          phone_number: res.data.data[0]?.phone_number,
        });
      })
      .catch((err) => console.error("❌ Lỗi lấy chi tiết đơn hàng:", err));
  }, [orderId]);

  return (
    <div className="admin-container">
      <Sidebar active="order" />

      <div className="admin-content">
        <div className="admin-header">
          <span className="admin-icon">🏷️</span>
          <div>
            <h2>ORDER</h2>
            <p>view, create, update, delete and manage.</p>
          </div>
        </div>

        <div className="order-address-box">
          <h3>Order Information</h3>
          <p><strong>Name:</strong> {orderInfo.name}</p>
          <p><strong>Phone:</strong> {orderInfo.phone_number}</p>
          <p><strong>Address:</strong> {orderInfo.address}</p>
        </div>

        <div className="order-details-title">ORDER DETAILS</div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>SIZE</th>
              <th>QUANTITY</th>
              <th>UNIT PRICE</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {details.map((item, index) => (
              <tr key={item.id} className={index % 2 === 1 ? "even" : ""}>
                <td className="product-cell">
                  {item.image && (
                    <img
                      src={item.image.startsWith("/")
                        ? item.image
                        : `/Img_project/${item.image}`}
                      alt="product"
                      className="product-img"
                    />
                  )}
                  {item.name}
                </td>
                <td>{item.size}</td>
                <td>{item.quantity}</td>
                <td>{item.price}$</td>
                <td>{item.quantity * item.price}$</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderDetail;