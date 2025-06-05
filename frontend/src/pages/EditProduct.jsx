import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/EditProduct.css';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        color: '',
        description: '',
        categoryId: '',
        subcategoryId: '',
        sizes: [],
        images: []
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:3030/api/products/${id}`);
                setProduct(res.data);
                setFormData({
                    name: res.data.name,
                    price: res.data.price,
                    color: res.data.color || '',
                    description: res.data.description || '',
                    categoryId: res.data.category_id || '',
                    subcategoryId: res.data.subcategory_id || '',
                    sizes: res.data.sizes || [],
                    images: []
                });
            } catch (err) {
                console.error('Failed to fetch product', err);
            }
        };
        fetchProduct();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSizeChange = (e) => {
        const size = e.target.value;
        setFormData((prev) => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter((s) => s !== size)
                : [...prev.sizes, size],
        }));
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, images: e.target.files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('color', formData.color);
        data.append('description', formData.description);
        data.append('categoryId', formData.categoryId);
        data.append('subcategoryId', formData.subcategoryId);
        formData.sizes.forEach((size) => data.append('sizes', size));
        for (const image of formData.images) {
            data.append('images', image);
        }

        try {
            await axios.put(`http://localhost:3030/api/products/${id}`, data);
            alert('Product updated successfully');
            navigate('/admin/product');
        } catch (err) {
            console.error('Update failed', err);
            alert('Failed to update product');
        }
    };

    if (!product) return <p>Loading...</p>;

    return (
        <div className="edit-product-container">
            <h2>Edit Product</h2>
            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                    <label>Price</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                    <label>Color</label>
                    <input type="text" name="color" value={formData.color} onChange={handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange}></textarea>
                </div>

                <div className="form-group">
                    <label>Sizes</label>
                    <div className="checkbox-group">
                        {['S', 'M', 'L', 'FREESIZE'].map((size) => (
                            <label key={size} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    value={size}
                                    checked={formData.sizes.includes(size)}
                                    onChange={handleSizeChange}
                                /> {size}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Upload Images</label>
                    <input type="file" name="images" multiple onChange={handleImageChange} />
                </div>

                <button type="submit" className="save-btn">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProduct;