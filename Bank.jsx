import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { isValidName } from "../../utils/Validation";

const Bank = () => {
  const [banks, setBanks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [name, setName] = useState("");
  const [active, setActive] = useState(true);

  // 🔹 LOAD BANKS FROM BACKEND
  const loadBanks = async () => {
    const res = await api.get("/banks");
    setBanks(res.data);
  };

  useEffect(() => {
    loadBanks();
  }, []);

  // ➕ ADD
  const openAddModal = () => {
    setEditId(null);
    setName("");
    setActive(true);
    setShowModal(true);
  };

  // ✏️ EDIT
  const openEditModal = (bank) => {
    setEditId(bank._id);
    setName(bank.name);
    setActive(bank.active);
    setShowModal(true);
  };

  // 💾 SAVE (CREATE / UPDATE)
  const saveBank = async () => {
    if (!isValidName(name)) return;

    if (editId) {
      await api.put(`/banks/${editId}`, { name, active });
    } else {
      await api.post("/banks", { name, active });
    }

    setShowModal(false);
    loadBanks();
  };

  // 🗑 DELETE
  const deleteBank = async (id) => {
    if (window.confirm("Delete this bank?")) {
      await api.delete(`/banks/${id}`);
      loadBanks();
    }
  };

  return (
    <div>
      <h4 className="mb-3">Bank Master</h4>

      <button className="btn btn-primary mb-3" onClick={openAddModal}>
        + Add Bank
      </button>

      <table className="table table-bordered bg-white">
        <thead className="table-light">
          <tr>
            <th>Bank Name</th>
            <th>Status</th>
            <th width="180">Actions</th>
          </tr>
        </thead>
        <tbody>
          {banks.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center text-muted">
                No banks found
              </td>
            </tr>
          )}

          {banks.map((bank) => (
            <tr key={bank._id}>
              <td>{bank.name}</td>
              <td>
                <span className={`badge ${bank.active ? "bg-success" : "bg-secondary"}`}>
                  {bank.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => openEditModal(bank)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteBank(bank._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{editId ? "Edit Bank" : "Add Bank"}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Bank Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

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
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  disabled={!isValidName(name)}
                  onClick={saveBank}
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

export default Bank;
