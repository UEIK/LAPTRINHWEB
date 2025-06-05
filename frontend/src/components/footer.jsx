// src/components/Footer/footer.jsx
import React from 'react';
import '../styles/footer.css'; // Điều chỉnh đường dẫn CSS nếu cần (từ components/Footer đến src/)
import '@fortawesome/fontawesome-free/css/all.min.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="logo-container">
        <img src='/Img_project/footer.jpg' alt="ELLE VIETNAM" className="logo" />

      </div>
      {/* Column 1: Explore Properties */}
      <div className="footer-column">
        <h3>Explore Properties</h3>
        <ul>
          <li><a href="/fandom">Fandom</a></li>
          <li><a href="/gamepedia">Gamepedia</a></li>
          <li><a href="/dnd-beyond">D&D Beyond</a></li>
          <li><a href="/cortex-rpg">Cortex RPG</a></li>

        </ul>
      </div>

      {/* Column 2: Follow Us */}
      <div className="footer-column">
        <h3>Follow Us</h3>
        <div className="social-icons">
          <a href="https://facebook.com"><i className="fab fa-facebook"></i></a>
          <a href="https://twitter.com"><i className="fab fa-twitter"></i></a>
          <a href="https://youtube.com"><i className="fab fa-youtube"></i></a>
          <a href="https://instagram.com"><i className="fab fa-instagram"></i></a>
          <a href="https://linkedin.com"><i className="fab fa-linkedin"></i></a>
        </div>
      </div>

      {/* Column 3: Overview */}
      <div className="footer-column">
        <h3>Overview</h3>
        <ul>
          <li><a href="/intro">About</a></li>
          <li><a href="/careers">Careers</a></li>
          <li><a href="/press">Press</a></li>
          <li><a href="/contact">Contact</a></li>

        </ul>
      </div>

      {/* Column 4: Community */}
      <div className="footer-column">
        <h3>Community</h3>
        <ul>
          <li><a href="/community-central">Community Central</a></li>
          <li><a href="/support">Support</a></li>
          <li><a href="/help">Help</a></li>
          <li><a href="/do-not-sell">Do Not Sell My Info</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;