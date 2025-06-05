import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import "../styles/NewAddress.css"

export default function NewAddress() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    address: "",
    firstname: "",
    lastname: "",
    phone: "",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const getUserFromStorage = () => {
    try {
      const userData = localStorage.getItem("user")
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error("Error parsing user data:", error)
      return null
    }
  }

  const user = getUserFromStorage()
  const userId = user?.id

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.address.trim()) {
      newErrors.address = "Address is required."
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required."
    }

    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required."
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required."
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Phone number must contain only digits."
    } else if (formData.phone.length < 9 || formData.phone.length > 11) {
      newErrors.phone = "Phone number must be 9-11 digits."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    if (!userId) {
      alert("User not identified. Please log in again.")
      return
    }

    setIsLoading(true)

    const payload = {
      address: formData.address.trim(),
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      phone: formData.phone.trim(),
      user_id: userId,
    }

    try {
      const res = await axios.get(`http://localhost:3030/api/address/${userId}`)
      const existing = res.data || []

      const isDuplicate = existing.some(
        (addr) =>
          addr.address.toLowerCase() === payload.address.toLowerCase() &&
          addr.firstname.toLowerCase() === payload.firstname.toLowerCase() &&
          addr.lastname.toLowerCase() === payload.lastname.toLowerCase() &&
          addr.phone === payload.phone,
      )

      if (isDuplicate) {
        alert("⚠️ This address information already exists!")
        setIsLoading(false)
        return
      }

      const saveResponse = await axios.post("http://localhost:3030/api/address", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (saveResponse.status === 200 || saveResponse.status === 201) {
        alert("✅ Address saved successfully!")

        // 👉 Quay về trang checkout và truyền lại giỏ hàng cũ nếu có
        navigate("/checkout", {
          state: {
            refresh: true,
            selectedItems: location.state?.selectedItems || [],
          },
        })
      } else {
        throw new Error(`Unexpected response status: ${saveResponse.status}`)
      }
    } catch (error) {
      console.error("❌ Error processing address:", error)

      if (error.response) {
        alert(`Server error: ${error.response.status} - ${error.response.data?.message || "Unknown error"}`)
      } else if (error.request) {
        alert("Unable to connect to server. Please check your network connection.")
      } else {
        alert("An error occurred while saving the information.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <div className="form-header">
          <div className="icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <h1 className="form-title">Add New Address</h1>
        </div>

        <p className="form-subtitle">Please fill in your delivery information</p>

        <div className="form-content">
          <div className="field-group">
            <div className="field-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Address</span>
            </div>
            <input
              type="text"
              name="address"
              placeholder="Enter your full address"
              value={formData.address}
              onChange={handleChange}
              className={`form-input ${errors.address ? "error" : ""}`}
            />
            {errors.address && <div className="error-message">{errors.address}</div>}
          </div>

          <div className="name-row">
            <div className="field-group half-width">
              <div className="field-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Last Name</span>
              </div>
              <input
                type="text"
                name="lastname"
                placeholder="Last name"
                value={formData.lastname}
                onChange={handleChange}
                className={`form-input ${errors.lastname ? "error" : ""}`}
              />
              {errors.lastname && <div className="error-message">{errors.lastname}</div>}
            </div>

            <div className="field-group half-width">
              <div className="field-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>First Name</span>
              </div>
              <input
                type="text"
                name="firstname"
                placeholder="First name"
                value={formData.firstname}
                onChange={handleChange}
                className={`form-input ${errors.firstname ? "error" : ""}`}
              />
              {errors.firstname && <div className="error-message">{errors.firstname}</div>}
            </div>
          </div>

          <div className="field-group">
            <div className="field-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Phone Number</span>
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className={`form-input ${errors.phone ? "error" : ""}`}
            />
            {errors.phone && <div className="error-message">{errors.phone}</div>}
          </div>

          <div className="info-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>Please ensure all information is accurate as this will be used for delivery.</span>
          </div>

          <button className="save-button" onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Saving...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17,21 17,13 7,13 7,21" />
                  <polyline points="7,3 7,8 15,8" />
                </svg>
                Save Address
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
