import { useState } from "react";

const PaymentModal = ({
  paymentMethod,
  setPaymentMethod,
  onConfirm,
  onClose,
  loading,
  setUpiId,
  setAddress,
  setBankDetails
}) => {
  const [localUpi, setLocalUpi] = useState("");
  const [localAddress, setLocalAddress] = useState("");

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");

  const handleConfirm = () => {
    setUpiId(localUpi);
    setAddress(localAddress);

    if (paymentMethod === "Bank") {
      setBankDetails({
        bankName,
        accountNumber,
        ifsc
      });
    }

    onConfirm();
  };

  const isBankValid =
    bankName && accountNumber && ifsc;

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <h5 className="mb-3">Payment Details</h5>

        {/* PAYMENT OPTIONS */}
        <div className="payment-options">
          {["Cash", "Bank", "UPI"].map((m) => (
            <button
              key={m}
              className={`pay-btn ${paymentMethod === m ? "active" : ""}`}
              onClick={() => setPaymentMethod(m)}
            >
              {m}
            </button>
          ))}
        </div>

        {/* UPI DETAILS */}
        {paymentMethod === "UPI" && (
          <input
            className="form-control mt-3"
            placeholder="Enter UPI ID (example@upi)"
            value={localUpi}
            onChange={(e) => setLocalUpi(e.target.value)}
          />
        )}

        {/* BANK DETAILS */}
        {paymentMethod === "Bank" && (
          <>
            <input
              className="form-control mt-3"
              placeholder="Bank Name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />

            <input
              className="form-control mt-2"
              placeholder="Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />

            <input
              className="form-control mt-2"
              placeholder="IFSC Code"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value)}
            />
          </>
        )}

        {/* ADDRESS */}
        <textarea
          className="form-control mt-3"
          placeholder="Delivery Address"
          rows="3"
          value={localAddress}
          onChange={(e) => setLocalAddress(e.target.value)}
        />

        <button
          className="btn btn-success w-100 mt-4"
          disabled={
            loading ||
            !paymentMethod ||
            !localAddress ||
            (paymentMethod === "UPI" && !localUpi) ||
            (paymentMethod === "Bank" && !isBankValid)
          }
          onClick={handleConfirm}
        >
          {loading ? "Processing..." : "Confirm & Pay"}
        </button>

        <button
          className="btn btn-outline-secondary w-100 mt-2"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
