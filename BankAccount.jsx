import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { isValidName } from "../../utils/Validation";

const BankAccount = () => {
  const [banks, setBanks] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [bankId, setBankId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [active, setActive] = useState(true);

  // 🔹 LOAD BANKS & ACCOUNTS FROM DB
  const loadBanks = async () => {
    const res = await api.get("/banks");
    setBanks(res.data);
  };

  const loadAccounts = async () => {
    const res = await api.get("/bank-accounts");
    setAccounts(res.data);
  };

  useEffect(() => {
    loadBanks();
    loadAccounts();
  }, []);

  const openAddModal = () => {
    setEditId(null);
    setBankId("");
    setAccountName("");
    setAccountNumber("");
    setOpeningBalance("");
    setActive(true);
    setShowModal(true);
  };

  const openEditModal = (acc) => {
    setEditId(acc._id);
    setBankId(acc.bankId?._id);
    setAccountName(acc.accountName);
    setAccountNumber(acc.accountNumber);
    setOpeningBalance(acc.openingBalance);
    setActive(acc.active);
    setShowModal(true);
  };

  const saveAccount = async () => {
    if (!bankId || !isValidName(accountName)) return;

    const payload = {
      bankId,
      accountName,
      accountNumber,
      openingBalance,
      active,
    };

    if (editId) {
      await api.put(`/bank-accounts/${editId}`, payload);
    } else {
      await api.post("/bank-accounts", payload);
    }

    setShowModal(false);
    loadAccounts();
  };

  const deleteAccount = async (id) => {
    if (window.confirm("Delete this bank account?")) {
      await api.delete(`/bank-accounts/${id}`);
      loadAccounts();
    }
  };

  return (
    <div>
      <h4 className="mb-3">Bank Account Master</h4>

      <button className="btn btn-primary mb-3" onClick={openAddModal}>
        + Add Bank Account
      </button>

      <table className="table table-bordered bg-white">
        <thead className="table-light">
          <tr>
            <th>Bank</th>
            <th>Account Name</th>
            <th>Account No</th>
            <th>Opening Balance</th>
            <th>Status</th>
            <th width="180">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No bank accounts found
              </td>
            </tr>
          )}

          {accounts.map((acc) => (
            <tr key={acc._id}>
              <td>{acc.bankId?.name}</td>
              <td>{acc.accountName}</td>
              <td>{acc.accountNumber}</td>
              <td>₹ {acc.openingBalance}</td>
              <td>
                <span className={`badge ${acc.active ? "bg-success" : "bg-secondary"}`}>
                  {acc.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => openEditModal(acc)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteAccount(acc._id)}>
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
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{editId ? "Edit Bank Account" : "Add Bank Account"}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>

              <div className="modal-body">
                <select
                  className="form-select mb-3"
                  value={bankId}
                  onChange={(e) => setBankId(e.target.value)}
                >
                  <option value="">Select Bank</option>
                  {banks.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>

                <input
                  className="form-control mb-2"
                  placeholder="Account Name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Account Number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />

                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Opening Balance"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                />

                <select
                  className="form-select"
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
                  disabled={!bankId || !isValidName(accountName)}
                  onClick={saveAccount}
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

export default BankAccount;
