import React, { useRef, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import '../styles/Homepage.css';

export default function HomePage() {
  const productRef = useRef(null);
  const sliderRef = useRef(null);
  const [activePage, setActivePage] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalPages = 3;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3030/api/products/search', {
        params: {
          category: 'New Collection',
          limit: 6,
        },
      });

      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const scrollToProducts = () => {
    productRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    const slider = sliderRef.current;
    if (slider) {
      const scrollLeft = slider.scrollLeft;
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      const scrollRatio = scrollLeft / maxScroll;
      const currentPage = Math.round(scrollRatio * (totalPages - 1));
      setActivePage(currentPage);
    }
  };

  const handleDotClick = (pageIndex) => {
    const slider = sliderRef.current;
    if (slider) {
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      const scrollX = (maxScroll / (totalPages - 1)) * pageIndex;
      slider.scrollTo({ left: scrollX, behavior: 'smooth' });
      setActivePage(pageIndex);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    slider?.addEventListener('scroll', handleScroll);
    return () => slider?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{ backgroundImage: "url('/Img_project/background.jpg')" }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">WHERE FASHION MEET INDIVIDUALITY</h1>
          <p className="hero-subtitle">Discover your unique style.</p>
          <button className="more-button" onClick={scrollToProducts}>
            Shop now
          </button>
        </div>
      </section>

      {/* Product Section */}
      <section ref={productRef} className="home-product-section">
        <h2 className="product-title">New Arrivals</h2>
        <div className="product-slider" ref={sliderRef}>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="home-product-card">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.thumbnail || '/Img_project/default-image.jpg'}
                    alt={product.name}
                    className="home-product-image"
                  />
                </Link>
                <div className="product-info">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-gray-600">${product.price.toFixed(0)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">No products in New Collection</div>
          )}
        </div>

        {/* Dot Indicators */}
        <div className="dot-indicators">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className={`dot ${index === activePage ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>

        <div className="see-product">
          <Link to="/product">
            <button>
              Explore more
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
