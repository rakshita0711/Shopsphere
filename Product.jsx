import { useEffect, useState } from "react";
import { isValidName } from "../../utils/Validation";
import { api } from "../../services/api";

const Product = () => {
  // 🔹 UNITS LIST
  const [units] = useState([
    "Piece",
    "Kg",
    "Gram",
    "Litre",
    "ML",
    "Box",
    "Packet",
  ]);

  // 🔹 DATA STATES
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // 🔹 MODAL STATE
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // 🔹 FORM STATES
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [active, setActive] = useState(true);

  // 🔔 POPUP STATE
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

  // 🔄 LOAD DATA FROM DB
  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch {
      showPopup("Failed to load categories ❌", "danger");
    }
  };

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch {
      showPopup("Failed to load products ❌", "danger");
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  // 🖼 IMAGE PREVIEW
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  // ➕ ADD MODAL
  const openAddModal = () => {
    setEditId(null);
    setName("");
    setCategoryId("");
    setQuantity("");
    setUnit("");
    setPrice("");
    setImage(null);
    setActive(true);
    setShowModal(true);
  };

  // ✏️ EDIT MODAL
  const openEditModal = (prod) => {
    setEditId(prod._id);
    setName(prod.name);
    setCategoryId(prod.categoryId?._id);
    setQuantity(prod.quantity);
    setUnit(prod.unit);
    setPrice(prod.price);
    setImage(prod.image);
    setActive(prod.active);
    setShowModal(true);
  };

  // 💾 SAVE PRODUCT (ADD / UPDATE)
  const saveProduct = async () => {
    if (!isValidName(name) || !categoryId || !quantity || !unit || !price) {
      showPopup("Please fill all required fields ❌", "danger");
      return;
    }

    const payload = {
      name,
      categoryId,
      quantity,
      unit,
      price,
      image,
      active,
    };

    try {
      if (editId) {
        await api.put(`/products/${editId}`, payload);
        showPopup("Product updated ✏️", "warning");
      } else {
        await api.post("/products", payload);
        showPopup("Product added ✅");
      }

      setShowModal(false);
      loadProducts();
    } catch {
      showPopup("Failed to save product ❌", "danger");
    }
  };

  // 🗑 DELETE PRODUCT
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      showPopup("Product deleted 🗑️", "danger");
      loadProducts();
    } catch {
      showPopup("Delete failed ❌", "danger");
    }
  };

  return (
    <div>
      <h4 className="mb-3">Product Master</h4>

      {popup.show && (
        <div className={`alert alert-${popup.type}`}>{popup.message}</div>
      )}

      <button className="btn btn-primary mb-3" onClick={openAddModal}>
        + Add Product
      </button>

      <table className="table table-bordered bg-white">
        <thead className="table-light">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Price</th>
            <th>Status</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                No products found
              </td>
            </tr>
          )}

          {products.map((prod) => (
            <tr key={prod._id}>
              <td>
                {prod.image && (
                  <img
                    src={prod.image}
                    alt={prod.name}
                    width="50"
                    height="50"
                    style={{ objectFit: "cover", borderRadius: 4 }}
                  />
                )}
              </td>
              <td>{prod.name}</td>
              <td>{prod.categoryId?.name}</td>
              <td>{prod.quantity}</td>
              <td>{prod.unit}</td>
              <td>₹ {prod.price}</td>
              <td>
                <span
                  className={`badge ${
                    prod.active ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {prod.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => openEditModal(prod)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteProduct(prod._id)}
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
                <h5>{editId ? "Edit Product" : "Add Product"}</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <select
                  className="form-control mb-2"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />

                <select
                  className="form-control mb-2"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="">Select Unit</option>
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />

                <input
                  type="file"
                  className="form-control mb-2"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    width="100"
                    height="100"
                    className="mt-2"
                    style={{ objectFit: "cover", borderRadius: 6 }}
                  />
                )}

                <select
                  className="form-control mt-2"
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
                <button className="btn btn-success" onClick={saveProduct}>
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

export default Product;
