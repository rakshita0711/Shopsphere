import html2pdf from "html2pdf.js";

const Invoice = ({ order, onClose }) => {
  const downloadPDF = () => {
    const element = document.getElementById("invoice-area");

    html2pdf()
      .set({
        margin: 10,
        filename: `Invoice_${order._id}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Invoice</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body" id="invoice-area">
            <h4 className="mb-2">ShopSphere</h4>
            <p className="mb-1">Invoice ID: {order._id}</p>
            <p className="mb-1">Date: {order.orderDate}</p>
            <p className="mb-3">Customer: {order.userName}</p>

            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((i, idx) => (
                  <tr key={idx}>
                    <td>{i.name}</td>
                    <td>{i.qty}</td>
                    <td>₹ {i.price}</td>
                    <td>₹ {i.qty * i.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h5 className="text-end">Grand Total: ₹ {order.totalAmount}</h5>

            <p className="mt-3">
              <strong>Payment:</strong> {order.paymentMethod}
            </p>

            {order.address && (
              <p>
                <strong>Address:</strong> {order.address}
              </p>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button className="btn btn-primary" onClick={downloadPDF}>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
