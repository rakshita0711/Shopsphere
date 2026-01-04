import { useEffect, useState } from "react";
import { isValidName } from "../../utils/Validation";
import { api } from "../../services/api";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);

  // 🔔 Popup
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: "", type: "" });
    }, 2500);
  };

  // 🔄 LOAD CATEGORIES FROM DB
  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch {
      showPopup("Failed to load categories ❌", "danger");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // ➕ ADD
  const openAddModal = () => {
    setEditId(null);
    setName("");
    setDescription("");
    setActive(true);
    setShowModal(true);
  };

  // ✏️ EDIT
  const openEditModal = (cat) => {
    setEditId(cat._id);
    setName(cat.name);
    setDescription(cat.description || "");
    setActive(cat.active);
    setShowModal(true);
  };

  // 💾 SAVE
  const saveCategory = async () => {
    if (!isValidName(name)) return;

    const payload = { name, description, active };

    try {
      if (editId) {
        await api.put(`/categories/${editId}`, payload);
        showPopup("Category updated ✏️", "warning");
      } else {
        await api.post("/categories", payload);
        showPopup("Category added ✅");
      }

      setShowModal(false);
      loadCategories();
    } catch (err) {
      showPopup(
        err.response?.data?.message || "Operation failed ❌",
        "danger"
      );
    }
  };

  // 🗑 DELETE
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      showPopup("Category deleted 🗑️", "danger");
      loadCategories();
    } catch {
      showPopup("Delete failed ❌", "danger");
    }
  };

  return (
    <div>
      <h4 className="mb-3">Category Master</h4>

      {popup.show && (
        <div className={`alert alert-${popup.type}`}>{popup.message}</div>
      )}

      <button className="btn btn-primary mb-3" onClick={openAddModal}>
        + Add Category
      </button>

      <table className="table table-bordered bg-white">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No categories found
              </td>
            </tr>
          )}

          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>
                <span
                  className={`badge ${
                    cat.active ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {cat.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>{new Date(cat.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => openEditModal(cat)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteCategory(cat._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{editId ? "Edit Category" : "Add Category"}</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Category Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <textarea
                  className="form-control mb-2"
                  placeholder="Category Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <select
                  className="form-control"
                  value={active}
                  onChange={(e) => setActive(e.target.value === "true")}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  disabled={!isValidName(name)}
                  onClick={saveCategory}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
