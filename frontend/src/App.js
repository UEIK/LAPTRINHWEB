import "../src/App.css";
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/nav";
import Footer from "./components/footer";
import Home from "./pages/Homepage";
import CategoryAdmin from "./pages/CategoryAdmin";
import Category from "./pages/Category";
import AddProduct from "./pages/AddProduct";
import Intro from "./pages/introduce";
import Help from "./pages/help";
import ProductDetail from "./pages/product-detail";
import Cart from "./pages/Cart";
import Account from "./pages/login_signup";
import Checkout from "./pages/Checkout";
import AccountInfo from "./pages/AccInfo";
import AdminUser from "./pages/AdminUser";
import AdminOrder from "./pages/AdminOrder";
import EditProduct from "./pages/EditProduct";
import AdminOrderDetail from "./pages/AdminOrderDetail";
import NewAddress from "./pages/NewAddress";
import RevenueReport from "./pages/RevenueReport";
import OrderSuccess from "./pages/OrderSuccess";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const resetSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      <Nav onSearch={(query) => { }} resetSearch={() => { }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/product"
          element={
            <Category searchQuery={searchQuery} resetSearch={resetSearch} />
          }
        />
        <Route
          path="/admin/product"
          element={
            <CategoryAdmin searchQuery={searchQuery} resetSearch={resetSearch} />
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<Account />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/help" element={<Help />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/accountinfo" element={<AccountInfo />} />
        <Route path="/admin/user" element={<AdminUser />} />
        <Route path="/admin/order" element={<AdminOrder />} />
        <Route path="/editproduct/:id" element={<EditProduct />} />
        <Route path="/admin/orderdetail" element={<AdminOrderDetail />} />
        <Route path="/newaddress" element={<NewAddress />} />
        <Route path="/admin/order/:orderId" element={<AdminOrderDetail />} />
        <Route path="/admin/order/details/:orderId" element={<AdminOrderDetail />} />
        <Route path="/admin/report" element={<RevenueReport />} />
        <Route path="/ordersuccess" element={<OrderSuccess />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
