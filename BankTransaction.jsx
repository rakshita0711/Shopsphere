import { useEffect, useState } from "react";
import { api } from "../../services/api";

const BankTransaction = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [bankAccountId, setBankAccountId] = useState("");
  const [type, setType] = useState("credit");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [remarks, setRemarks] = useState("");

  /* ================= LOAD DATA ================= */
  const loadBankAccounts = async () => {
    const res = await api.get("/bank-accounts");
    setBankAccounts(res.data);
  };

  const loadTransactions = async () => {
    const res = await api.get("/bank-transactions");
    setTransactions(res.data);
  };

  useEffect(() => {
    loadBankAccounts();
    loadTransactions();
  }, []);

  /* ================= MODAL HANDLERS ================= */
  const openAddModal = () => {
    setEditId(null);
    setBankAccountId("");
    setType("credit");
    setAmount("");
    setDate(new Date().toISOString().slice(0, 10)); // ✅ default date
    setRemarks("");
    setShowModal(true);
  };

  const openEditModal = (tx) => {
    setEditId(tx._id);
    setBankAccountId(tx.bankAccountId?._id);
    setType(tx.type);
    setAmount(tx.amount);
    setDate(tx.date);
    setRemarks(tx.remarks || "");
    setShowModal(true);
  };

  /* ================= SAVE ================= */
  const saveTransaction = async () => {
    if (!bankAccountId || !amount || Number(amount) <= 0) return;

    const payload = {
      bankAccountId,
      type,
      amount: Number(amount), // ✅ FIX
      date: date || new Date().toISOString().slice(0, 10), // ✅ FIX
      remarks,
    };

    try {
      if (editId) {
        await api.put(`/bank-transactions/${editId}`, payload);
      } else {
        await api.post("/bank-transactions", payload);
      }

      setShowModal(false);
      loadTransactions();
    } catch (error) {
      console.error("Failed to save transaction", error);
      alert("Failed to save transaction ❌");
    }
  };

  /* ================= DELETE ================= */
  const deleteTransaction = async (id) => {
    if (window.confirm("Delete this transaction?")) {
      await api.delete(`/bank-transactions/${id}`);
      loadTransactions();
    }
  };

  return (
    <div>
      <h4 className="mb-3">Bank Transactions</h4>

      <button className="btn btn-primary mb-3" onClick={openAddModal}>
        + Add Transaction
      </button>

      <table className="table table-bordered bg-white">
        <thead className="table-light">
          <tr>
            <th>Bank Account</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Remarks</th>
            <th width="160">Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No bank transactions found
              </td>
            </tr>
          )}

          {transactions.map((tx) => (
            <tr key={tx._id}>
              <td>
                {tx.bankAccountId?.bankId?.name} -{" "}
                {tx.bankAccountId?.accountName}
              </td>
              <td>
                <span
                  className={`badge ${
                    tx.type === "credit" ? "bg-success" : "bg-danger"
                  }`}
                >
                  {tx.type}
                </span>
              </td>
              <td>₹ {tx.amount}</td>
              <td>{tx.date}</td>
              <td>{tx.remarks}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => openEditModal(tx)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteTransaction(tx._id)}
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
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>
                  {editId ? "Edit Bank Transaction" : "Add Bank Transaction"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body">
                <select
                  className="form-select mb-2"
                  value={bankAccountId}
                  onChange={(e) => setBankAccountId(e.target.value)}
                >
                  <option value="">Select Bank Account</option>
                  {bankAccounts.map((acc) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.bankId?.name} - {acc.accountName}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select mb-2"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>

                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <input
                  type="date"
                  className="form-control mb-2"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />

                <input
                  className="form-control"
                  placeholder="Remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
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
                  onClick={saveTransaction}
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

export default BankTransaction;
