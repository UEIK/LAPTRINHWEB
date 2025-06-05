import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import AdminSidebar from "../components/sidebar";
import "../styles/AdminUser.css";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editData, setEditData] = useState({ name: "", role_id: 1 });
  const [confirmId, setConfirmId] = useState(null);
  const [confirmSaveId, setConfirmSaveId] = useState(null);

  // ✅ Fetch users từ API
  const fetchUsers = async (page = 1) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3030/api/admin/users?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.data);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    } catch (err) {
      console.error("🚀 ~ fetch users error:", err);
    }
  };


  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // ✅ Xử lý Delete
  const handleDelete = (id) => {
    const isAdmin = users.find((u) => u.id === id)?.role_id === 2;
    const totalAdmins = users.filter((u) => u.role_id === 2).length;

    if (isAdmin && totalAdmins === 1) {
      alert("❌ Không thể xóa tài khoản Admin cuối cùng!");
      return;
    }

    setConfirmId(id);
  };


  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3030/api/admin/users/${confirmId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter((u) => u.id !== confirmId));
      alert("✅ Xóa tài khoản thành công!");
    } catch (err) {
      console.error("🚀 ~ delete user error:", err);
      alert("❌ Xóa tài khoản thất bại!");
    }
    setConfirmId(null);
  };

  const cancelDelete = () => setConfirmId(null);

  // ✅ Xử lý Edit
  const startEdit = (user) => {
    setEditUserId(user.id);
    setEditData({ name: user.name, role_id: user.role_id });
  };

  const askSaveEdit = (id) => setConfirmSaveId(id);

  const confirmSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3030/api/admin/users/${confirmSaveId}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedUsers = users.map((u) =>
        u.id === confirmSaveId ? { ...u, ...editData } : u
      );
      setUsers(updatedUsers);

      alert("✅ Cập nhật tài khoản thành công!");
    } catch (err) {
      console.error("🚀 ~ update user error:", err);
      alert("❌ Cập nhật tài khoản thất bại!");
    }
    setEditUserId(null);
    setConfirmSaveId(null);
  };

  const cancelSave = () => {
    setEditUserId(null);
    setConfirmSaveId(null);
  };

  return (
    <div className="admin-container">
      <AdminSidebar active="user" />

      <div className="admin-content">
        <div className="admin-header">
          <span className="admin-icon">🏷️</span>
          <div>
            <h2>USER</h2>
            <p>view, create, update and manage.</p>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>LEVEL</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className={index % 2 === 1 ? "even" : ""}>
                <td>{(currentPage - 1) * limit + (index + 1)}</td>

                <td>
                  {editUserId === user.id ? (
                    <input
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                  ) : (
                    user.name
                  )}
                </td>

                <td>{user.email}</td>

                <td>
                  {editUserId === user.id ? (
                    <select
                      value={editData.role_id}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          role_id: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value={1}>Client</option>
                      <option value={2}>Admin</option>
                    </select>
                  ) : user.role_id === 2 ? (
                    "Admin"
                  ) : (
                    "Client"
                  )}
                </td>

                <td>
                  {editUserId === user.id ? (
                    <button onClick={() => askSaveEdit(user.id)}>Save</button>
                  ) : (
                    <>
                      <FaEdit className="icon edit" onClick={() => startEdit(user)} />
                      <FaTrash className="icon delete" onClick={() => handleDelete(user.id)} />
                    </>
                  )}
                </td>
              </tr>
            ))}
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

      {confirmId && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Do you want delete this account?</p>
            <div className="confirm-actions">
              <button className="confirm-yes" onClick={confirmDelete}>Yes</button>
              <button className="confirm-no" onClick={cancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}

      {confirmSaveId && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Do you want to save the changes?</p>
            <div className="confirm-actions">
              <button className="confirm-yes" onClick={confirmSave}>Yes</button>
              <button className="confirm-no" onClick={cancelSave}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUser;