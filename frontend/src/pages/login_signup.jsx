// src/pages/login_signup.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../styles/login_signup.css"

const LoginSignup = () => {
  const [action, setAction] = useState("Login")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const navigate = useNavigate()

  // ✅ Khởi tạo Google One Tap khi component mount
  useEffect(() => {
    if (action === "Login" && window.google) {
      initGoogleButton()
    }
  }, [action])

  // ✅ Khởi tạo Google Button
  const initGoogleButton = () => {
    window.google.accounts.id.initialize({
      client_id: "971172897244-aqj4ssd9r6v68612qqts5j2r7t08b8n4.apps.googleusercontent.com", // ⚠️ Thay bằng Client ID của bạn
      callback: handleGoogleResponse,
      auto_select: false
    })

    window.google.accounts.id.renderButton(
      document.getElementById("google-button-container"),
      { 
        type: "standard", 
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: 280
      }
    )
  }

  // ✅ Xử lý response từ Google
  const handleGoogleResponse = async (response) => {
    setIsGoogleLoading(true)
    
    try {
      // Gửi credential đến backend
      const res = await axios.post(
        "http://localhost:3030/api/auth/google",
        { credential: response.credential },
        { headers: { "Content-Type": "application/json" } }
      )

      const user = res.data.data
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(user))

      alert("✅ Đăng nhập Google thành công!")

      const redirectPath = localStorage.getItem("redirectAfterLogin")
      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin")
        navigate(redirectPath)
      } else {
        if (user.role_id === 2) {
          navigate("/admin/user")
        } else {
          navigate("/home")
        }
      }
    } catch (err) {
      console.error("🚀 ~ Google login error:", err.response?.data || err.message)
      alert(`❌ ${err.response?.data?.message || "Đăng nhập Google thất bại!"}`)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  // ✅ Login thường (giữ nguyên)
  const handleSubmit = async () => {
    if (action === "Login") {
      if (!email || !password) {
        alert("❌ Bạn cần nhập đầy đủ Email và Password!")
        return
      }

      try {
        const res = await axios.post(
          "http://localhost:3030/api/auth/login",
          { email, password },
          { headers: { "Content-Type": "application/json" } }
        )

        const user = res.data.data
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("user", JSON.stringify(user))

        alert("✅ Đăng nhập thành công!")

        const redirectPath = localStorage.getItem("redirectAfterLogin")
        if (redirectPath) {
          localStorage.removeItem("redirectAfterLogin")
          navigate(redirectPath)
        } else {
          if (user.role_id === 2) {
            navigate("/admin/user")
          } else {
            navigate("/home")
          }
        }
      } catch (err) {
        console.error("🚀 ~ login error:", err.response?.data || err.message)
        alert(`❌ ${err.response?.data?.message || "Đăng nhập thất bại!"}`)
      }
    } else {
      if (!username || !email || !password) {
        alert("❌ Bạn cần nhập đầy đủ Username, Email và Password!")
        return
      }

      try {
        const res = await axios.post(
          "http://localhost:3030/api/auth/register",
          { name: username, email, password },
          { headers: { "Content-Type": "application/json" } }
        )

        alert("✅ Đăng ký thành công! Đăng nhập ngay nào!")
        setAction("Login")
        setUsername("")
        setEmail("")
        setPassword("")
      } catch (err) {
        console.error("🚀 ~ register error:", err.response?.data || err.message)
        alert(`❌ ${err.response?.data?.message || "Đăng ký thất bại!"}`)
      }
    }
  }

  return (
    <div className="account-page">
      <div className="account-container">
        <div className="account-header">
          <div className="account-text">{action === "Login" ? "LOGIN" : "SIGN UP"}</div>
        </div>

        <div className="account-inputs">
          {action === "Sign Up" && (
            <div className="account-input">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          <div className="account-input">
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="account-input">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="account-submit-container">
          <div className="account-submit" onClick={handleSubmit}>
            {action === "Login" ? "Sign in" : "Create"}
          </div>

          {/* ✅ Google Login Button */}
          {action === "Login" && (
            <>
              <div className="divider">
                <span>or</span>
              </div>

              {/* Google Button Container */}
              <div id="google-button-container" className="google-button-container"></div>
              
              {/* Fallback nếu Google button không load */}
              <div 
                className={`google-login-button ${isGoogleLoading ? "loading" : ""}`}
                style={{display: 'none'}} // Ẩn đi, chỉ hiện khi Google button không load
              >
                <div className="google-icon">
                  {isGoogleLoading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                </div>
                Continue with Google
              </div>
            </>
          )}

          {action === "Login" ? (
            <>
              <div className="no-account-text">You don't have an account?</div>
              <div className="account-submit secondary" onClick={() => setAction("Sign Up")}>
                Sign up
              </div>
            </>
          ) : (
            <>
              <div className="no-account-text">You already have an account?</div>
              <div className="account-submit secondary" onClick={() => setAction("Login")}>
                Login
              </div>
            </>
          )}
        </div>

        <div className="return-store" onClick={() => navigate("/home")}>
          Return to Store
        </div>
      </div>
    </div>
  )
}

export default LoginSignup