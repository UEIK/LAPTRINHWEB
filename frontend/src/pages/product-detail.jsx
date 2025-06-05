import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/product-detail.css';
import { GrFormPrevious } from "react-icons/gr";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('White');
  const [selectedSize, setSelectedSize] = useState('M');

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/api/products/${id}`);
        setProduct(response.data);
        setSelectedColor(response.data.color || 'N/A');
        setSelectedSize(response.data.sizes[0] || 'N/A');
        setLoading(false);
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = async () => {
    if (!userId) {
      alert("Please log in to add items to your cart.");
      navigate("/account");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3030/api/cart/add",
        {
          userId,
          productId: id,
          quantity,
          color: selectedColor,
          size: selectedSize,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Product added to cart successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error adding to cart:", error);
      const errorMessage = error.response?.data?.message || "Failed to add product to cart.";
      if (error.response?.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        navigate("/login");
      } else if (error.response?.status === 403) {
        alert("Admin can not add product to cart");
      } else {
        alert(errorMessage);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Product not found</div>;

  return (
    <div className="product-detail-container">
      <button className="back-btn" onClick={handleBack}>
        < GrFormPrevious size={30} />
      </button>
      <div className="product-detail-images">
        <div className="main-image">
          <img
            src={product.thumbnail || 'default-image.jpg'}
            alt={product.name}
          />
        </div>
      </div>

      <div className="product-detail-info">
        <h1 className="product-detail-name">{product.name}</h1>
        <p className="product-detail-price">${product.price}</p>

        <div className="product-detail-options">
          <label>Color</label>
          <div className="color-options">
            {product.color ? (
              <button
                className={`color-btn ${selectedColor === product.color ? 'selected' : ''}`}
                onClick={() => handleColorSelect(product.color)}
              >
                {product.color}
              </button>
            ) : (
              <span>No colors available</span>
            )}
          </div>
        </div>

        <div className="product-detail-options">
          <label>Size</label>
          <div className="size-options">
            {product.sizes && product.sizes.length > 0 ? (
              product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))
            ) : (
              <span>No sizes available</span>
            )}
          </div>
        </div>

        <div className="product-detail-options">
          <label>Amount</label>
          <div className="quantity-selector">
            <button onClick={handleDecrease}>-</button>
            <span>{quantity}</span>
            <button onClick={handleIncrease}>+</button>
          </div>
        </div>

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          <span className="cart-icon">🛒</span> Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;