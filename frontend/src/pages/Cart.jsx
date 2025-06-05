import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Cart.css";
import { ImBin2 } from "react-icons/im";

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) {
        setError("Please log in to view your cart.");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3030/api/cart/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const cartItems = response.data.CartItems.map((cartItem) => ({
          id: cartItem.id,
          productId: cartItem.product_id,
          name: cartItem.Product.name,
          color: cartItem.color,
          size: cartItem.size,
          price: cartItem.Product.price,
          quantity: cartItem.quantity,
          selected: true,
          image: cartItem.Product.Galleries?.[0]?.thumbnail || '/default-image.jpg',
          availableSizes: cartItem.Product.Sizes?.map((s) => s.size) || [],
        }));

        setItems(cartItems);
        setLoading(false);
      } catch (err) {
        setError("Failed to load cart. Please try again later.");
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId, navigate]);

  const toggleSelect = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const changeQuantity = async (id, delta) => {
    const item = items.find((item) => item.id === id);
    const newQuantity = Math.max(1, item.quantity + delta);

    try {
      await axios.put(
        `http://localhost:3030/api/cart/item/${id}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setItems(
        items.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity.");
    }
  };

  const changeSize = async (id, newSize) => {
    const item = items.find((item) => item.id === id);

    try {
      const response = await axios.put(
        `http://localhost:3030/api/cart/item/${id}`,
        { size: newSize },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.message === "Cart item merged with existing item") {
        setItems((prevItems) => {
          const existingItem = prevItems.find(
            (i) =>
              i.productId === item.productId &&
              i.color === item.color &&
              i.size === newSize &&
              i.id !== id
          );
          if (existingItem) {
            existingItem.quantity += item.quantity;
            return prevItems.filter((i) => i.id !== id);
          }
          return prevItems.map((i) =>
            i.id === id ? { ...i, size: newSize } : i
          );
        });
      } else {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, size: newSize } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating size:", error);
      alert(error.response?.data?.error || "Failed to ...");
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3030/api/cart/item/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item from cart.");
    }
  };

  const total = items
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    const selectedItems = items.filter(item => item.selected);
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }
    navigate("/checkout", { state: { selectedItems } });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="cart-container">
      <div className="cart-left">
        <div className="cart-title">
          <input
            type="checkbox"
            checked={items.every((item) => item.selected)}
            onChange={() => {
              const allSelected = items.every((item) => item.selected);
              setItems(
                items.map((item) => ({ ...item, selected: !allSelected }))
              );
            }}
          />
          ALL ITEMS ({items.length})
        </div>

        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="cart-item">
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => toggleSelect(item.id)}
              />
              <img src={item.image} alt={item.name} className="cart-image" />
              <div className="cart-info">
                <div className="cart-name">{item.name}</div>
                <div className="cart-color-size">
                  {item.color} / {""}
                  <select
                    value={item.size}
                    onChange={(e) => changeSize(item.id, e.target.value)}
                    className="size-select"
                  >
                    {item.availableSizes.length > 0 ? (
                      item.availableSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))
                    ) : (
                      <option value={item.size}>{item.size}</option>
                    )}
                  </select>
                </div>
                <div className="cart-price">${item.price.toLocaleString()}</div>
              </div>
              <div className="cart-actions">
                <button onClick={() => changeQuantity(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => changeQuantity(item.id, 1)}>+</button>
                <button
                  className="delete-btn"
                  onClick={() => removeItem(item.id)}
                >
                  <ImBin2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-cart">Your cart is empty.</div>
        )}
      </div>

      <div className="cart-right">
        <p>
          Retail Price: <span>${total.toLocaleString()}</span>
        </p>
        <p>
          Promotions: <span>$0</span>
        </p>
        <hr />
        <p className="estimated">
          ESTIMATED PRICE: <span>${total.toLocaleString()}</span>
        </p>
        <button className="order-btn" onClick={handleCheckout}>
          ORDER
        </button>
      </div>
    </div>
  );
};

export default Cart;
