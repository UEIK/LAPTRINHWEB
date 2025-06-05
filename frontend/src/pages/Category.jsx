import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Category.css";
import "../styles/page-container.css";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";

const Category = ({ searchQuery, resetSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialPage = parseInt(searchParams.get('page')) || 1;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [openCategories, setOpenCategories] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [filters, setFilters] = useState({
    colors: [],
    sizes: [],
    priceRange: [0, 10000],
  });
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 16;

  const fetchProducts = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('search') || searchQuery || '';

        const response = await axios.get('http://localhost:3030/api/products/search', {
          params: {
            query,
            category: selectedCategory !== 'All' ? selectedCategory : undefined,
            subcategory: selectedSubcategory !== 'All' ? selectedSubcategory : undefined,
            colors: filters.colors.length > 0 ? filters.colors.join(',') : undefined,
            sizes: filters.sizes.length > 0 ? filters.sizes.join(',') : undefined,
            priceMin: filters.priceRange[0],
            priceMax: filters.priceRange[1],
            sortBy: sortBy || undefined,
            page,
            limit: productsPerPage,
          },
        });

        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [location.search, searchQuery, selectedCategory, selectedSubcategory, filters, sortBy, productsPerPage]
  );

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3030/api/categories");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get("http://localhost:3030/api/categories/subcategories", {
        params: { categoryId },
      });
      setSubcategories((prev) => ({
        ...prev,
        [categoryId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching sidebar subcategories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);


  // Cập nhật URL khi currentPage thay đổi
  useEffect(() => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('page', currentPage);
    navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
    fetchProducts(currentPage);

    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
    } else {
      window.scrollTo(0, 0);
    }
  }, [currentPage, fetchProducts, navigate, location.pathname, location.search]);

  //Phân trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  //Bộ lọc  
  const handleFilterChange = (type, value) => {
    if (type === "color") {
      setFilters((prev) => ({
        ...prev,
        colors: prev.colors.includes(value)
          ? prev.colors.filter((c) => c !== value)
          : [...prev.colors, value],
      }));
    } else if (type === "size") {
      setFilters((prev) => ({
        ...prev,
        sizes: prev.sizes.includes(value)
          ? prev.sizes.filter((s) => s !== value)
          : [...prev.sizes, value],
      }));
    } else if (type === "price") {
      setFilters((prev) => ({
        ...prev,
        priceRange: value,
      }));
    }
    setCurrentPage(1);
  };

  //Sắp xếp
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  //xử lý mở danh mục con
  const toggleCategory = (categoryId) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
    if (!subcategories[categoryId]) {
      fetchSubcategories(categoryId);
    }
  };

  const handleSubcategorySelect = (category, subcategory) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setCurrentPage(1);
    resetSearch();
    setOpenCategories((prev) => ({
      ...prev,
      [category]: true,
    }));
  };

  return (
    <div className="page-container">
      <div className="product-section">
        <div className="sidebar">
          <div className="filter-section">
            <h3>
              <span
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedSubcategory("All");
                  setOpenCategories({});
                  resetSearch();
                }}
                style={{ cursor: "pointer" }}
                className={selectedCategory === "All" ? "active" : ""}
              >
                All Products
              </span>
            </h3>
          </div>

          {categories.map((cat) => (
            <div key={cat.id} className="filter-section">
              <h3>
                <span
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setSelectedSubcategory("All");
                    setCurrentPage(1);
                    resetSearch();
                    toggleCategory(cat.id);
                  }}
                  style={{ cursor: "pointer" }}
                  className={selectedCategory === cat.name ? "active" : ""}
                >
                  {cat.name}
                </span>
                <span
                  onClick={() => toggleCategory(cat.id)}
                  className={`arrow ${openCategories[cat.id] ? "open" : ""}`}
                >
                  &#9662;
                </span>
              </h3>
              {openCategories[cat.id] && (
                <ul>
                  {subcategories[cat.id]?.map((sub) => (
                    <li
                      key={sub.id}
                      onClick={() => handleSubcategorySelect(cat.name, sub.name)}
                      style={{ cursor: "pointer" }}
                      className={selectedSubcategory === sub.name ? "active" : ""}
                    >
                      {sub.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="product-grid-container">
          <div className="grid-header">
            <div className="filters">
              <button onClick={() => setIsFilterOpen(!isFilterOpen)}>
                Filters
              </button>
              {isFilterOpen && (
                <div className="filter-panel">
                  <div className="filter-row">
                    <div className="filter-group">
                      <h4>Color</h4>
                      <div className="filter-options">
                        {['Gray', 'Blue', 'Black', 'White'].map((color) => (
                          <label key={color}>
                            <input
                              type="checkbox"
                              value={color}
                              checked={filters.colors.includes(color)}
                              onChange={() => handleFilterChange('color', color)}
                            />
                            {color}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="filter-group">
                      <h4>Size</h4>
                      <div className="filter-options">
                        {['S', 'M', 'L', 'FREESIZE'].map((size) => (
                          <label key={size}>
                            <input
                              type="checkbox"
                              value={size}
                              checked={filters.sizes.includes(size)}
                              onChange={() => handleFilterChange('size', size)}
                            />
                            {size}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="filter-group">
                    <h4>Price Range</h4>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={filters.priceRange[0]}
                      onChange={(e) =>
                        handleFilterChange("price", [
                          Number(e.target.value),
                          filters.priceRange[1],
                        ])
                      }
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        handleFilterChange("price", [
                          filters.priceRange[0],
                          Number(e.target.value),
                        ])
                      }
                    />
                    <div>
                      ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="sort-by">
              <select value={sortBy} onChange={handleSortChange}>
                <option value="">Sort by</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>
          <div className="product-grid">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="product-card">
                  <Link
                    to={`/product/${product.id}`}
                    state={{ fromPage: currentPage }}
                  >
                    <div className="product-image-container">
                      <img
                        src={product.thumbnail || "default-image.jpg"}
                        alt={product.name}
                        className="product-image"
                        style={{ objectPosition: "50% 90%" }}
                      />
                    </div>
                  </Link>
                  <Link to={`/product/${product.id}`}
                    state={{ fromPage: currentPage }}
                  >
                    <h4 className="product_name">{product.name}</h4>
                  </Link>
                  <p className="product_price">${product.price}</p>
                </div>
              ))
            ) : (
              <div className="no-products">No products found</div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                < GrFormPrevious size={20} />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`pagination-btn ${currentPage === page ? "active" : ""
                      }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                < GrFormNext size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
