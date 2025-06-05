import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

const Sidebar = () => {
  const items = [
    { label: "USER", path: "/admin/user" },
    { label: "ORDER", path: "/admin/order" },
    { label: "PRODUCT", path: "/admin/product" },
    { label: "REPORT", path: "/admin/report" },
  ];

  return (
    <div className="admin-sidebar">
      <h2>MENU</h2>
      <ul>
        {items.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
