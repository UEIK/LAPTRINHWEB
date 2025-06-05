import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/nav.css";
import { CgProfile } from "react-icons/cg";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BsCart } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

const Nav = ({ onSearch, resetSearch }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Theo dõi thay đổi localStorage và cả đường dẫn (sau logout hoặc login)
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser(); // lần đầu
    window.addEventListener("storage", loadUser);

    return () => window.removeEventListener("storage", loadUser);
  }, []);

  useEffect(() => {
    // Khi đổi route, kiểm tra lại user (nếu vừa logout)
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("search") || "";
    setSearchQuery(query);
    if (location.pathname === "/product" && query) {
      setIsSearchOpen(true);
      onSearch(query);
    }
  }, [location.search, location.pathname, onSearch]);

  const handleSearchToggle = () => {
    if (isSearchOpen && searchQuery.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchQuery)}`);
    } else {
      setIsSearchOpen(true);
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    resetSearch();
    if (location.pathname === "/product") {
      navigate("/product");
    }
  };

  const handleAccountClick = () => {
    if (user) {
      navigate("/accountinfo");
    } else {
      navigate("/account");
    }
  };

  const handleCartClick = () => {
    if (!user) {
      const confirmLogin = window.confirm("You need to log in to access the cart. Click OK to log in.");
      if (confirmLogin) {
        localStorage.setItem("redirectAfterLogin", "/cart"); // 🔥 lưu đường dẫn mong muốn
        navigate("/account");
      }
    } else {
      navigate("/cart");
    }
  };

  return (
    <>
      <div className="navbar">
        <div className="logo">
          <Link to="/home" className="active"><span>ELLE</span></Link>
        </div>

        <div className="nav-links">
          <Link to="/home" className="active"><span>HOME</span></Link>
          <Link to="/intro" className="active"><span>INTRO</span></Link>
          <Link to="/product" className="active"><span>PRODUCT</span></Link>
          <Link to="/help" className="active"><span>HELP</span></Link>
        </div>

        <div className="nav-icons">
          <span onClick={handleSearchToggle} style={{ cursor: "pointer" }}>
            <FaMagnifyingGlass size={20} className={`search-icon ${isSearchOpen ? "active" : ""}`} />
          </span>

          <span onClick={handleAccountClick} style={{ cursor: "pointer" }}>
            <CgProfile size={20} />
            {user && (
              <span style={{ marginLeft: "6px", fontWeight: "bold" }}>{user.username}</span>
            )}
          </span>

          <span onClick={handleCartClick} style={{ cursor: "pointer" }}>
            <BsCart size={20} />
          </span>
        </div>
      </div>

      {isSearchOpen && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
          <button onClick={handleCloseSearch} className="close-search">
            <IoMdClose size={25} />
          </button>
        </div>
      )}
    </>
  );
};

export default Nav;
