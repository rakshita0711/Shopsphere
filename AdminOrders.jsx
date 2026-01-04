import { useEffect, useState } from "react";
import { api } from "../../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [openOrderId, setOpenOrderId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const res = await api.get("/orders");
    setOrders(res.data.orders || []);
  };

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    loadOrders();
  };

  const toggleItems = (id) => {
    setOpenOrderId(openOrderId === id ? null : id);
  };

  return (
    <div className="p-3">
      <h4>Orders</h4>

      <table className="table table-bordered bg-white">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Address</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th width="200">Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o, index) => (
            <>
              {/* MAIN ROW */}
              <tr key={o._id}>
                <td>{index + 1}</td>

                <td>{o.userId?.email}</td>

                <td>{o.address || "—"}</td>

                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => toggleItems(o._id)}
                  >
                    {openOrderId === o._id ? "Hide Items" : "View Items"}
                  </button>
                </td>

                <td>₹ {o.totalAmount}</td>

                <td>
                  <span
                    className={`badge ${
                      o.status === "approved"
                        ? "bg-success"
                        : o.status === "cancelled"
                        ? "bg-danger"
                        : "bg-warning"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>

                <td>
                  <button
                    className="btn btn-sm btn-success me-2"
                    disabled={o.status !== "pending"}
                    onClick={() => updateStatus(o._id, "approved")}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    disabled={o.status !== "pending"}
                    onClick={() => updateStatus(o._id, "cancelled")}
                  >
                    Cancel
                  </button>
                </td>
              </tr>

              {/* ITEMS ROW */}
              {openOrderId === o._id && (
                <tr>
                  <td colSpan="7">
                    <div className="d-flex gap-3 flex-wrap">
                      {o.items.map((item) => (
                        <div
                          key={item._id}
                          className="card"
                          style={{ width: 150 }}
                        >
                          {item.productId?.image && (
                            <img
                              src={item.productId.image}
                              alt={item.productId.name}
                              className="card-img-top"
                              style={{
                                height: 100,
                                objectFit: "contain",
                              }}
                            />
                          )}

                          <div className="card-body p-2 text-center">
                            <div className="fw-bold small">
                              {item.productId?.name}
                            </div>
                            <div className="text-muted small">
                              Qty: {item.qty}
                            </div>
                            <div className="text-success fw-bold small">
                              ₹ {item.price * item.qty}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
