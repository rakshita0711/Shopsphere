import { useEffect, useState } from "react";
import { api } from "../../services/api";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [cashList, setCashList] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("cash");
  const [cashId, setCashId] = useState("");
  const [bankAccountId, setBankAccountId] = useState("");
  const [date, setDate] = useState("");
  const [remarks, setRemarks] = useState("");

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      setExpenses((await api.get("/expenses")).data);
      setCashList((await api.get("/cash")).data);
      setBankAccounts((await api.get("/bank-accounts")).data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    setDate(new Date().toISOString().slice(0, 10));
  }, []);

  /* ================= OPEN ADD MODAL ================= */
  const openAddModal = () => {
    setEditId(null);
    setTitle("");
    setAmount("");
    setPaymentType("cash");
    setCashId("");
    setBankAccountId("");
    setDate(new Date().toISOString().slice(0, 10));
    setRemarks("");
    setShowModal(true);
  };

  /* ================= OPEN EDIT MODAL ================= */
  const openEditModal = (e) => {
    setEditId(e._id);
    setTitle(e.title);
    setAmount(e.amount);
    setPaymentType(e.paymentType);
    setCashId(e.cashId?._id || "");
    setBankAccountId(e.bankAccountId?._id || "");
    setDate(e.date);
    setRemarks(e.remarks || "");
    setShowModal(true);
  };

  /* ================= SAVE (ADD / UPDATE) ================= */
  const saveExpense = async () => {
    if (!title || !amount) {
      alert("Title and amount are required");
      return;
    }

    const payload = {
      title,
      amount: Number(amount),
      paymentType,
      cashId: paymentType === "cash" ? cashId : null,
      bankAccountId: paymentType === "bank" ? bankAccountId : null,
      date,
      remarks,
    };

    try {
      if (editId) {
        await api.put(`/expenses/${editId}`, payload); // UPDATE
      } else {
        await api.post("/expenses", payload); // CREATE
      }

      setShowModal(false);
      setEditId(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to save expense ❌");
    }
  };

  /* ================= DELETE ================= */
  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await api.delete(`/expenses/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete expense ❌");
    }
  };

  return (
    <div>
      {/* ================= HEADER ================= */}
      <h4 className="mb-2">Expenses</h4>

      <button className="btn btn-primary mb-3" onClick={openAddModal}>
        + Add Expense
      </button>

      {/* ================= TABLE ================= */}
      <table className="table table-bordered bg-white">
        <thead className="table-light">
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Paid Via</th>
            <th>Date</th>
            <th>Remarks</th>
            <th width="150">Actions</th>
          </tr>
        </thead>

        <tbody>
          {expenses.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No expenses found
              </td>
            </tr>
          )}

          {expenses.map((e) => (
            <tr key={e._id}>
              <td>{e.title}</td>
              <td>₹ {e.amount}</td>
              <td>
                {e.paymentType === "cash"
                  ? e.cashId?.name
                  : `${e.bankAccountId?.bankId?.name} - ${e.bankAccountId?.accountName}`}
              </td>
              <td>{e.date}</td>
              <td>{e.remarks}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => openEditModal(e)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteExpense(e._id)}
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
                <h5>{editId ? "Edit Expense" : "Add Expense"}</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Expense Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <select
                  className="form-select mb-2"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank</option>
                </select>

                {paymentType === "cash" && (
                  <select
                    className="form-select mb-2"
                    value={cashId}
                    onChange={(e) => setCashId(e.target.value)}
                  >
                    <option value="">Select Cash</option>
                    {cashList.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}

                {paymentType === "bank" && (
                  <select
                    className="form-select mb-2"
                    value={bankAccountId}
                    onChange={(e) => setBankAccountId(e.target.value)}
                  >
                    <option value="">Select Bank Account</option>
                    {bankAccounts.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.bankId?.name} - {b.accountName}
                      </option>
                    ))}
                  </select>
                )}

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
                <button className="btn btn-success" onClick={saveExpense}>
                  Save Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
