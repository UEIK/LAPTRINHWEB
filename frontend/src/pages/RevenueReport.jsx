import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/sidebar";
import "../styles/RevenueReport.css";
import { Link } from "react-router-dom";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";

const RevenueReport = () => {
    const [reportData, setReportData] = useState([]);
    const [groupBy, setGroupBy] = useState("month");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 15;

    // Lấy danh sách sản phẩm để chọn lọc
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost:3030/api/products/search?limit=1000");
                setProducts(res.data.products || []);
            } catch (err) {
                console.error("❌ Lỗi lấy danh sách sản phẩm:", err);
            }
        };
        fetchProducts();
    }, []);


    // Lấy dữ liệu báo cáo theo filter
    const fetchReport = async () => {
        try {
            const params = { groupBy, page: currentPage, limit };
            if (selectedProduct) params.productId = selectedProduct;
            const res = await axios.get("http://localhost:3030/api/reports/revenue", { params });
            setReportData(res.data.data || []);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("❌ Lỗi lấy báo cáo doanh thu:", err);
            setReportData([]);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [currentPage, selectedProduct, groupBy]);



    return (
        <div className="admin-container">
            <AdminSidebar active="REVENUE" />

            <div className="admin-content">
                <div className="admin-header">
                    <div>
                        <h2>REVENUE REPORT</h2>
                        <p>View report</p>
                    </div>
                </div>

                {/* Bộ lọc */}
                <div className="filter-section-report">
                    <label>
                        Time:&nbsp;
                        <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                            <option value="day">By day</option>
                            <option value="month">By month</option>
                            <option value="year">By year</option>
                        </select>
                    </label>

                    <label>
                        Product:&nbsp;
                        <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                            <option value="">All product</option>
                            {products.map((prod) => (
                                <option key={prod.id} value={prod.id}>
                                    {prod.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button onClick={fetchReport} className="btn-apply">
                        Apply
                    </button>
                </div>

                {/* Bảng báo cáo */}
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Product name</th>
                            <th>Quantity</th>
                            <th>Revenue</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", fontStyle: "italic", color: "#999" }}>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            reportData.map((item, index) => (
                                <tr key={index} className={index % 2 === 1 ? "even" : ""}>
                                    <td>{item.period}</td>
                                    <td>{item.product_name}</td>
                                    <td>{item.total_quantity_sold}</td>
                                    <td>{item.total_revenue.toLocaleString()}</td>
                                    <td>
                                        <Link to={`/product/${item.product_id}`} className="viewproduct-link">
                                            View product
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="pagination-admin">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        < GrFormPrevious size={20} />
                    </button>

                    <span>Page {currentPage} of {totalPages}</span>

                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        < GrFormNext size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RevenueReport;
