import { useEffect, useState } from "react";
import { api } from "../../services/api";

const Reports = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    const res = await api.get("/reports");
    setReport(res.data);
  };

  if (!report) {
    return <p>Loading report...</p>;
  }

  return (
    <div>
      <h4 className="mb-4">Financial Reports</h4>

      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card p-3 text-center shadow-sm">
            <h6>Total Cash In</h6>
            <h4 className="text-success">₹ {report.cashIn}</h4>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card p-3 text-center shadow-sm">
            <h6>Total Cash Out</h6>
            <h4 className="text-danger">₹ {report.cashOut}</h4>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card p-3 text-center shadow-sm">
            <h6>Total Expenses</h6>
            <h4 className="text-warning">₹ {report.expenses}</h4>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card p-3 text-center shadow-sm">
            <h6>Total Bank Credit</h6>
            <h4 className="text-success">₹ {report.bankCredit}</h4>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card p-3 text-center shadow-sm">
            <h6>Total Bank Debit</h6>
            <h4 className="text-danger">₹ {report.bankDebit}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;


