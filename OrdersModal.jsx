import { useEffect, useState } from "react";
import { api } from "../services/api";

const OrdersModal = ({ userId, onClose, onInvoice }) => {
  const [orders, setOrders] = useState([]);
  const [openOrderId, setOpenOrderId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const res = await api.get(`/orders/user/${userId}`);
    setOrders(res.data);
  };

  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    await api.put(`/orders/${id}/cancel`);
    loadOrders();
  };

  const toggleItems = (id) => {
    setOpenOrderId(openOrderId === id ? null : id);
  };
  const getImageSrc = (item) => {
    // product populated but image missing
    if (!item.productId || !item.productId.image) {
      return null; // IMPORTANT → avoids empty src
    }

    return item.productId.image; // base64 string
  };

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          {/* HEADER */}
          <div className="modal-header">
            <h5>My Orders</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">
            {orders.length === 0 && (
              <p className="text-center text-muted">🛒 No orders placed yet</p>
            )}

            {orders.map((o) => (
              <div key={o._id} className="border rounded p-3 mb-3">
                {/* SUMMARY */}
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>₹ {o.totalAmount}</strong>
                    <div className="text-muted small">
                      {new Date(o.createdAt).toLocaleDateString()} •{" "}
                      {o.items.length} items
                    </div>
                  </div>

                  <span
                    className={`badge ${
                      o.status === "paid"
                        ? "bg-success"
                        : o.status === "cancelled"
                          ? "bg-danger"
                          : "bg-warning"
                    }`}
                  >
                    {o.status}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="mt-3">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => toggleItems(o._id)}
                  >
                    {openOrderId === o._id ? "Hide Items" : "View Items"}
                  </button>

                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => onInvoice(o)}
                  >
                    Invoice
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    disabled={o.status !== "pending"}
                    onClick={() => cancelOrder(o._id)}
                  >
                    Cancel
                  </button>
                </div>

                {/* ITEMS GRID */}
                {openOrderId === o._id && (
                  <div className="row mt-3">
                    {o.items.map((item, idx) => {
                      const imgSrc = getImageSrc(item);

                      return (
                        <div key={idx} className="col-md-4 mb-3">
                          <div className="card h-100 shadow-sm">
                            {imgSrc && (
                              <img
                                src={imgSrc}
                                alt={item.name}
                                className="card-img-top"
                                style={{
                                  height: 130,
                                  objectFit: "contain",
                                  background: "#f8f8f8",
                                }}
                              />
                            )}

                            <div className="card-body p-2 text-center">
                              <div className="fw-semibold small">
                                {item.name}
                              </div>

                              <div className="text-muted small">
                                Qty: {item.qty}
                              </div>

                              <div className="text-success fw-bold small">
                                ₹ {item.price * item.qty}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersModal;
