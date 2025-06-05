import React from 'react';
import '../styles/introduce.css'; // File CSS của bạn

const Introduce = () => {
  return (
    <>
      {/* Phần đầu với video quảng bá ELLE */}
      <div className="introduce-container">
        <video
          className="introduce-video"
          src="Img_project/introduce.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Phần tiêu đề và nội dung văn bản */}
      <div className="intro_container">
        <h1 className="title">
           EMBRACE CONFIDENCE
        </h1>

        <div className="text-container">
          <div className="column-introduce">
            ELLE is more than a fashion label—it’s a manifesto of confidence and individuality. 
            Drawing inspiration from the modern woman’s bold elegance, we craft premium designs 
            that empower and inspire.
          </div>
          <div className="column-introduce">
            Our collections blend global trends with timeless Asian flair, celebrating authentic 
            beauty. Committed to sustainability, we source top-quality materials and prioritize 
            eco-friendly production at every step.
          </div>
        </div>

        {/* Phần thống kê */}
        <div className="stats">
          <div className="stat">
            +3.100 <span>M€</span>
            <div className="label">Annual Revenue</div>
          </div>
          <div className="stat">
            50+
            <div className="label">Boutiques Worldwide</div>
          </div>
          <div className="stat">
            1,500+
            <div className="label">Design & Production Team</div>
          </div>
          <div className="stat">
            70%
            <div className="label">E-Commerce Growth</div>
          </div>
        </div>
      </div>

      {/* Phần hình ảnh */}
      <div className="image-3-container">
        <div className="image-box">
          <img src="Img_project/img-introduce.png" alt="Business & Production" />
          <p className="label">Business & Production</p>
        </div>
        <div className="image-box">
          <img src="Img_project/img1-introduce.png" alt="Environmental Protection" />
          <p className="label">Environmental Protection</p>
        </div>
        <div className="image-box">
          <img src="Img_project/img2-introduce.png" alt="Life & People" />
          <p className="label">Life & People</p>
        </div>
      </div>
    </>
  );
};

export default Introduce;
