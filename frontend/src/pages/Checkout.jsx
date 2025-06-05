import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import "../styles/Checkout.css"

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()

  const [selectedAddress, setSelectedAddress] = useState(null)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showOptions, setShowOptions] = useState({})
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const user = JSON.parse(localStorage.getItem("user"))
  const userId = user?.id
  const userEmail = user?.email

  useEffect(() => {
    if (location.state?.refresh) {
      setRefreshKey(prev => prev + 1)
      navigate(location.pathname, { replace: true })
    }
  }, [location.state, navigate])

  useEffect(() => {
    const loadData = async () => {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        const addressResponse = await axios.get(`http://localhost:3030/api/address/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSavedAddresses(addressResponse.data)

        if (location.state && location.state.selectedItems) {
          setCartItems(location.state.selectedItems)
        } else {
          const cartResponse = await axios.get(`http://localhost:3030/api/cart/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          setCartItems(cartResponse.data.data || [])
        }
      } catch (error) {
        console.error("Error loading data:", error)
        setCartItems([])
        setSavedAddresses([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [userId, refreshKey])

  const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0), 0)

  const handleNewAddressClick = () => {
    navigate("/newaddress", { state: { fromCheckout: true, selectedItems: cartItems } })
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address")
      return
    }

    const address = savedAddresses.find((addr) => addr.id === selectedAddress)
    const token = localStorage.getItem("token")

    const orderPayload = {
      user_id: userId,
      name: `${address.firstname} ${address.lastname}`,
      email: userEmail,
      phone_number: address.phone,
      address: address.address,
      total_money: totalPrice,
      items: cartItems.map((item) => ({
        product_id: item.productId || item.id,
        quantity: item.quantity || 1,
        price: item.price || 0,
        size: item.size || "",
        total_money: (item.price || 0) * (item.quantity || 1),
      })),
    }

    try {
      const res = await axios.post("http://localhost:3030/api/order", orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status === 201) {
        navigate("/ordersuccess")
      }
    } catch (error) {
      console.error("❌ Error placing order:", error)
      alert("Order failed. Please try again.")
    }
  }

  const handleDeleteAddress = (id) => {
    setConfirmDeleteId(id)
  }

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3030/api/address/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSavedAddresses(prev => prev.filter(addr => addr.id !== confirmDeleteId));

      const alertBox = document.createElement("div");
      alertBox.className = "floating-alert";
      alertBox.innerText = "This address is deleted";
      document.body.appendChild(alertBox);

      setTimeout(() => {
        document.body.removeChild(alertBox);
      }, 2000);
    } catch (error) {
      console.error("Lỗi xoá địa chỉ:", error);
      alert("❌ Xoá thất bại!");
    } finally {
      setConfirmDeleteId(null);
    }
  }

  const cancelDelete = () => {
    setConfirmDeleteId(null)
  }

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
      </div>
    )
  }

  const displayItems = cartItems

  return (
    <div className="checkout-page">
      <div className="address-section">
        {savedAddresses.length > 0 ? (
          savedAddresses.map((addr) => (
            <div
              key={addr.id}
              className={`address-item ${selectedAddress === addr.id ? "selected" : ""}`}
            >
              <div className="address-left" onClick={() => setSelectedAddress(addr.id)}>
                <input
                  type="radio"
                  checked={selectedAddress === addr.id}
                  onChange={() => setSelectedAddress(addr.id)}
                />
                <div className="address-details">
                  <strong>{addr.firstname} {addr.lastname}</strong>
                  <div>{addr.address}</div>
                  <div>{addr.phone}</div>
                </div>
              </div>

              <div className="address-options-container">
                {showOptions[addr.id] && (
                  <div className="address-options-menu">
                    <button className="delete-btn" onClick={() => handleDeleteAddress(addr.id)}>Delete</button>
                  </div>
                )}
                <button
                  className="address-options"
                  onClick={() =>
                    setShowOptions(prev => ({
                      ...prev,
                      [addr.id]: !prev[addr.id]
                    }))
                  }
                >
                  ︙
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-address">
            <p>No delivery addresses available</p>
          </div>
        )}

        <div className="new-address-container">
          <button className="new-address-btn" onClick={handleNewAddressClick}>
            New address
          </button>
        </div>
      </div>

      <div className="main-content">
        {displayItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="product-section-checkout">
            <table className="product-table">
              <thead>
                <tr>
                  <th className="product-column">PRODUCT</th>
                  <th className="size-column">SIZE</th>
                  <th className="quantity-column">QUANTITY</th>
                  <th className="price-column">UNIT PRICE</th>
                  <th className="total-column">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {displayItems.map((item, idx) => (
                  <tr key={item.id || idx} className={idx % 2 === 1 ? "even" : ""}>
                    <td className="product-column">
                      <div className="product-cell">
                        <div className="product-icon">
                          <img
                            src={item.image || "/placeholder.svg?height=50&width=50"}
                            alt={item.name || "Product"}
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=50&width=50"
                            }}
                          />
                        </div>
                        <div className="product-name">{item.name || "Product"}</div>
                      </div>
                    </td>
                    <td className="size-column">{item.size || ""}</td>
                    <td className="quantity-column">{item.quantity || 1}</td>
                    <td className="price-column">{item.price || 0}$</td>
                    <td className="total-column">{(item.quantity || 1) * (item.price || 0)}$</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="summary-section">
          <div className="summary-box">
            <div className="summary-header">Order Summary</div>
            <div className="summary-content">
              <p>
                Total ({totalQuantity} items): <strong>{totalPrice}$</strong>
              </p>
              <p>
                Payment method: <strong>Ship cod</strong>
              </p>
            </div>
          </div>

          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={displayItems.length === 0 || !selectedAddress}
          >
            Place an order
          </button>
        </div>
      </div>

      {confirmDeleteId && (
        <div className="confirm-modal">
          <p>Do you want to delete this address?</p>
          <div className="confirm-buttons">
            <button onClick={confirmDelete}>Confirm</button>
            <button onClick={cancelDelete}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
