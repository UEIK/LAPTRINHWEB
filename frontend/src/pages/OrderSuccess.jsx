import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OrderSuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/product?page=1"); // hoặc /product nếu muốn về trang mua hàng
  };

  return (
    <div className="success-container">
      <h1>Order successfully!</h1>
      <img
        src="/Img_project/order success.gif"
        alt="Success"
        className="success-icon"
      />
      <h2>THANK FOR YOUR ORDER.</h2>
      <button onClick={handleContinue} className="shopping-link">
        Shopping more
      </button>
    </div>
  );
};

export default OrderSuccess;
