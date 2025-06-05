import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdOutlineFileUpload } from "react-icons/md";
import "../styles/AddProduct.css";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState([]);
  const [color, setColor] = useState("");
  const [images, setImages] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [sidebarSubcategories, setSidebarSubcategories] = useState({});
  const [openCategories, setOpenCategories] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3030/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error.response?.data || error.message);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (categoryId) {
        try {
          const response = await axios.get('http://localhost:3030/api/categories/subcategories', {
            params: { categoryId },
          });
          setSubcategories(response.data);
        } catch (error) {
          console.error('Error fetching subcategories:', error.response?.data || error.message);
        }
      } else {
        setSubcategories([]);
        setSubcategoryId('');
      }
    };
    fetchSubcategories();
  }, [categoryId]);

  const fetchSidebarSubcategories = async (categoryId) => {
    try {
      const response = await axios.get('http://localhost:3030/api/categories/subcategories', {
        params: { categoryId },
      });
      setSidebarSubcategories((prev) => ({
        ...prev,
        [categoryId]: response.data,
      }));
    } catch (error) {
      console.error('Error fetching sidebar subcategories:', error.response?.data || error.message);
    }
  };

  const handleSizeChange = (size) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAdd = async () => {
    if (!name || !price || !categoryId) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', Number(price));
    formData.append('description', description);
    formData.append('color', color);
    formData.append('categoryId', categoryId);
    if (subcategoryId && subcategoryId !== "") {
      formData.append("subcategoryId", subcategoryId);
    }
    sizes.forEach((size) => formData.append('sizes[]', size));
    images.forEach((image) => formData.append('images', image));

    console.log("Form data:", {
      name: name.trim(),
      price: Number(price),
      description,
      color,
      categoryId,
      subcategoryId,
      sizes,
      images: images.map((img) => img.name),
    });

    try {
      await axios.post("http://localhost:3030/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product added successfully!");
      setName("");
      setPrice("");
      setDescription("");
      setSizes([]);
      setColor("");
      setImages([]);
      setCategoryId("");
      setSubcategoryId("");
      navigate("/product");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
      setName("");
      setPrice("");
      setDescription("");
      setSizes([]);
      setColor("");
      setImages([]);
      setCategoryId("");
      setSubcategoryId("");
      navigate("/product");
    }
  };

  //xử lý mở danh mục con
  const toggleCategory = (categoryId) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
    if (!sidebarSubcategories[categoryId]) {
      fetchSidebarSubcategories(categoryId);
    }
  };

  return (
    <div className="product-section">
      <div className="sidebar">
        <div className="filter-section">
          <h3>
            <span
              onClick={() => { navigate("/product"); }}
              style={{ cursor: "pointer" }}
            >
              All Products
            </span>
          </h3>
        </div>
        {categories.map((cat) => (
          <div key={cat.id} className="filter-section">
            <h3>
              <span
                onClick={() => { toggleCategory(cat.id); }}
                style={{ cursor: "pointer" }} >
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
                {(sidebarSubcategories[cat.id] || []).map((sub) => (
                  <li
                    key={sub.id}
                    style={{ cursor: 'pointer' }}
                  >
                    {sub.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="add-product-container">
        <h2>ADD PRODUCT</h2>
        <div className="add-product-form">
          <div className="form-group">
            <label className="required">Name</label>
            <input
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="required">Price</label>
              <input
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="required">Size</label>
            <div className="size-options">
              {["S", "M", "L", "XL", "FREESIZE", "36", "37", "38", "39", "40", "41", "42", "43"].map((size) => (
                <label key={size}>
                  <input
                    type="checkbox"
                    checked={sizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-picker">
              <input
                type="text"
                placeholder="Enter color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <span>{color || "Select a color"}</span>
            </div>
          </div>

          <div className="form-group">
            <label className="required">Images</label>
            <div className="image-upload">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-button">
                <span><MdOutlineFileUpload size={30} color="#999" /></span>
              </label>
              <div className="uploaded-images">
                {images.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img src={URL.createObjectURL(image)} alt={`preview-${index}`} />
                    <button onClick={() => removeImage(index)}>X</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="required">Category</label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSubcategoryId('');
              }}
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Subcategory</label>
            <select
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              disabled={!categoryId || subcategories.length === 0}
            >
              <option value="" disabled>
                {subcategories.length === 0 ? 'No subcategories available' : 'Select subcategory'}
              </option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            <button className="add-btn" onClick={handleAdd}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;