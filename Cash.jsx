import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { isValidName } from "../../utils/Validation";

const Cash = () => {
  const [cashList, setCashList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [name, setName] = useState("");
  const [active, setActive] = useState(true);

  /* ================= LOAD CASH ================= */
  const loadCash = async () => {
    const res = await api.get("/cash");
    setCashList(res.data);
  };

  useEffect(() => {
    loadCash();
  }, []);

  /* ================= MODAL HANDLERS ================= */
  const openAddModal = () => {
    setEditId(null);
    setName("");
    setActive(true);
    setShowModal(true);
  };

  const openEditModal = (cash) => {
    setEditId(cash._id);
    setName(cash.name);
    setActive(cash.active);
    setShowModal(true);
  };

  /* ================= SAVE ================= */
  const saveCash = async () => {
    if (!isValidName(name)) return;

    const payload = { name, active };

    if (editId) {
      await api.put(`/cash/${editId}`, payload);
    } else {
      await api.post("/cash", payload);
    }

    setShowModal(false);
    loadCash();
  };

  /* ================= DELETE ================= */
  const deleteCash = async (id) => {
    if (window.confirm("Delete this cash entry?")) {
      await api.delete(`/cash/${id}`);
      loadCash();
    }
  };

  return (
    <div>
      <h4 className="mb-3">Cash Master</h4>

      <button className="btn btn-primary mb-3" onClick={openAddModal}>
        + Add Cash
      </button>

      <table className="table table-bordered bg-white">
        <thead className="table-light">
          <tr>
            <th>Cash Name</th>
            <th>Status</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {cashList.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center text-muted">
                No cash entries found
              </td>
            </tr>
          )}

          {cashList.map((cash) => (
            <tr key={cash._id}>
              <td>{cash.name}</td>
              <td>
                <span
                  className={`badge ${
                    cash.active ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {cash.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => openEditModal(cash)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteCash(cash._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{editId ? "Edit Cash" : "Add Cash"}</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Cash Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {!isValidName(name) && name && (
                  <small className="text-danger">
                    Name must be 2–14 characters
                  </small>
                )}

                <select
                  className="form-select mt-2"
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
                  onClick={saveCash}
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

export default Cash;
