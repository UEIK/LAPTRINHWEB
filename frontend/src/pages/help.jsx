import React from 'react';
import '../styles/help.css';

function Help() {
  return (

    <div className="main-container">
      <div className="help-gif">
        <img src="Img_project/help.gif" alt="GIF help" className="help_gif" />
      </div>
      <div className="help-container">
        <h1>HELP CENTER</h1>
      </div>
      <div className="columns-container">
        {/* Left Column */}
        <div className="column">
          {/* Delivery Section */}
          <div className="section">
            <div className="delivery-section delivery-section--underline">
              <i className="fas fa-truck delivery-icon"></i>
              <span>Delivery</span>
            </div>
            <div className="delivery-section">
              <span>Where's my order?</span>
            </div>
            <div className="delivery-section">
              <span>Delivery Options</span>
            </div>
          </div>

          {/* Product & Stock Section */}
          <div className="section">
            <div className="delivery-section delivery-section--underline">
              <i className="fas fa-box delivery-icon"></i>
              <span>Product & Stock</span>
            </div>
            <div className="delivery-section">
              <span>Size guide</span>
            </div>
            <div className="section-link">
              <span>Save for later</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="column">
          {/* Order Issues Section */}
          <div className="section">
            <div className="delivery-section delivery-section--underline">
              <i className="fas fa-exclamation-circle delivery-icon"></i>
              <span>Order Issues</span>
            </div>
            <div className="delivery-section">
              <span>Amend or cancel order</span>
            </div>
            <div className="delivery-section">
              <span>Something's wrong with my item</span>
            </div>
            <div className="delivery-section">
              <span>Missing item</span>
            </div>
          </div>

          {/* Returns & Refunds Section */}
          <div className="section">
            <div className="delivery-section delivery-section--underline">
              <i className="fas fa-undo delivery-icon"></i>
              <span>Returns & Refunds</span>
            </div>
            <div className="delivery-section">
              <span>How do I return?</span>
            </div>
            <div className="section-link">
              <span>Policy</span>
            </div>
          </div>
        </div>
      </div>
      <div class="contact-text">
        <h1>CONTACT US</h1>
      </div>
      <div class="contact">

        <div className="contact-columns">
          <div className="contact-column">
            <div className="contact-item">
              <i className="fas fa-clock contact-icon"></i>
              <p>7 DAYS PRODUCT EXCHANGE AT THE ORIGINAL PRICE</p>
            </div>
          </div>
          <div className="contact-column">
            <div className="contact-item">
              <i className="fas fa-phone-alt contact-icon"></i>
              <p>HOTLINE 1900 6060<br />8:00 A.M - 9:00 P.M MONDAY - SATURDAY (BUSINESS HOURS)</p>
            </div>
          </div>
          <div className="contact-column">
            <div className="contact-item">
              <i className="fas fa-store contact-icon"></i>
              <p>STORE SYSTEM<br />120 STORES ACROSS THE ENTIRE SYSTEM</p>
            </div>
          </div>
          <div className="contact-column">
            <div className="contact-item">
              <i className="fas fa-shipping-fast contact-icon"></i>
              <p>SHIPPING<br />FLAT RATE 60K NATIONWIDE</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Help;