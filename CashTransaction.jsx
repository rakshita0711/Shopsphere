import { useEffect, useState } from "react";
import { api } from "../../services/api";

const CashTransaction = () => {
  const [cashAccounts, setCashAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [cashId, setCashId] = useState("");
  const [type, setType] = useState("in");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [remarks, setRemarks] = useState("");

  /* LOAD DATA */
  const loadCash = async () => {
    const res = await api.get("/cash");
    setCashAccounts(res.data);
  };

  const loadTransactions = async () => {
    const res = await api.get("/cash-transactions");
    setTransactions(res.data);
  };

  useEffect(() => {
    loadCash();
    loadTransactions();
  }, []);

  const openAddModal = () => {
    setEditId(null);
    setCashId("");
    setType("in");
    setAmount("");
    setDate(new Date().toISOString().slice(0, 10));
    setRemarks("");
    setShowModal(true);
  };

  const openEditModal = (tx) => {
    setEditId(tx._id);
    setCashId(tx.cashId?._id);
    setType(tx.type);
    setAmount(tx.amount);
    setDate(tx.date);
    setRemarks(tx.remarks || "");
    setShowModal(true);
  };

  const saveTransaction = async () => {
    if (!cashId || !amount || Number(amount) <= 0) return;

    const payload = {
      cashId,
      type,
      amount: Number(amount),
      date,
      remarks,
    };

    if (editId) {
      await api.put(`/cash-transactions/${editId}`, payload);
    } else {
      await api.post("/cash-transactions", payload);
    }

    setShowModal(false);
    loadTransactions();
  };

  const deleteTransaction = async (id) => {
    if (window.confirm("Delete this transaction?")) {
      await api.delete(`/cash-transactions/${id}`);
      loadTransactions();
    }
  };

  return (
    <div>
      <h4 className="mb-3">Cash Transactions</h4>

      <button className="btn btn-primary mb-3" onClick={openAddModal}>
        + Add Transaction
      </button>

      <table className="table table-bordered bg-white">
        <thead className="table-light">
          <tr>
            <th>Cash</th>
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
                No transactions found
              </td>
            </tr>
          )}

          {transactions.map((tx) => (
            <tr key={tx._id}>
              <td>{tx.cashId?.name}</td>
              <td>
                <span className={`badge ${tx.type === "in" ? "bg-success" : "bg-danger"}`}>
                  {tx.type === "in" ? "IN" : "OUT"}
                </span>
              </td>
              <td>₹ {tx.amount}</td>
              <td>{tx.date}</td>
              <td>{tx.remarks}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => openEditModal(tx)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteTransaction(tx._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{editId ? "Edit Cash Transaction" : "Add Cash Transaction"}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>

              <div className="modal-body">
                <select className="form-select mb-2" value={cashId} onChange={(e) => setCashId(e.target.value)}>
                  <option value="">Select Cash</option>
                  {cashAccounts.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select className="form-select mb-2" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="in">Cash In</option>
                  <option value="out">Cash Out</option>
                </select>

                <input type="number" className="form-control mb-2" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <input type="date" className="form-control mb-2" value={date} onChange={(e) => setDate(e.target.value)} />
                <input className="form-control" placeholder="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={saveTransaction}>
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

export default CashTransaction;
