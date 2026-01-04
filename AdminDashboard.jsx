import {
  useState,
  useEffect,
  lazy,
  Suspense,
  useRef,
} from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../services/api";

// Masters
import Category from "../masters/Category";
import Product from "../masters/Product";
import Bank from "../masters/Bank";
import Cash from "../masters/Cash";
import BankAccount from "../masters/BankAccount";
import CashTransaction from "../masters/CashTransaction";
import BankTransaction from "../masters/BankTransaction";
import Expenses from "../masters/Expenses";

// Lazy loaded
const Reports = lazy(() => import("../masters/Reports"));
const AdminOrders = lazy(() => import("../admin/AdminOrders"));

const COMMANDS = [
  { label: "Orders", key: "orders" },
  { label: "Products", key: "product" },
  { label: "Categories", key: "category" },
  { label: "Reports", key: "reports" },
  { label: "Expenses", key: "expenses" },
  { label: "Bank Accounts", key: "bank-account" },
  { label: "Cash Transactions", key: "cash-transaction" },
];

const AdminDashboard = ({ onLogout }) => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [timeNow, setTimeNow] = useState(new Date());

  // 💾 Persisted dark mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("adminDarkMode") === "true"
  );

  const [showPalette, setShowPalette] = useState(false);
  const [search, setSearch] = useState("");

  const prevPendingRef = useRef(0);
  const [shakeAlert, setShakeAlert] = useState(false);

  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    today: 0,
    weekly: 0,
  });

  /* ================= LIVE CLOCK ================= */
  useEffect(() => {
    const timer = setInterval(() => setTimeNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ================= SAVE DARK MODE ================= */
  useEffect(() => {
    localStorage.setItem("adminDarkMode", darkMode);
  }, [darkMode]);

  /* ================= KEYBOARD SHORTCUT (CTRL + K) ================= */
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowPalette(true);
        setSearch("");
      }
      if (e.key === "Escape") {
        setShowPalette(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /* ================= LOAD ORDER STATS ================= */
  useEffect(() => {
    if (activeMenu === "dashboard") {
      loadOrderStats();
    }
  }, [activeMenu]);

  const loadOrderStats = async () => {
    try {
      const res = await api.get("/orders");
      const orders = res.data.orders || [];

      const todayStr = new Date().toDateString();
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const pending = orders.filter(o => o.status === "pending").length;

      // 🔔 Trigger shake when pending increases
      if (pending > prevPendingRef.current) {
        setShakeAlert(true);
        setTimeout(() => setShakeAlert(false), 600);
      }
      prevPendingRef.current = pending;

      setOrderStats({
        total: orders.length,
        pending,
        today: orders.filter(
          o => new Date(o.createdAt).toDateString() === todayStr
        ).length,
        weekly: orders.filter(
          o => new Date(o.createdAt) >= weekAgo
        ).length,
      });
    } catch (err) {
      console.error("Failed to load order stats");
    }
  };

  const filteredCommands = COMMANDS.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  const alertType =
    orderStats.pending >= 10 ? "danger" : "warning";

  const renderContent = () => {
    switch (activeMenu) {
      case "category": return <Category />;
      case "product": return <Product />;
      case "bank": return <Bank />;
      case "bank-account": return <BankAccount />;
      case "bank-transaction": return <BankTransaction />;
      case "cash": return <Cash />;
      case "cash-transaction": return <CashTransaction />;
      case "reports":
        return (
          <Suspense fallback={<p>Loading reports...</p>}>
            <Reports />
          </Suspense>
        );
      case "expenses": return <Expenses />;
      case "orders":
        return (
          <Suspense fallback={<p>Loading orders...</p>}>
            <AdminOrders />
          </Suspense>
        );

      default:
        return (
          <>
            {/* ===== HEADER ===== */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="mb-0">ShopSphere Admin Dashboard</h3>
                <small className="text-muted">
                  {timeNow.toDateString()} • {timeNow.toLocaleTimeString()}
                </small>
              </div>

              <div className="d-flex gap-2">
                <span className="badge bg-success">● Live</span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? "☀ Light" : "🌙 Dark"}
                </button>
              </div>
            </div>

            {/* ===== PENDING ALERT ===== */}
            {orderStats.pending > 0 && (
              <div
                className={`alert alert-${alertType} d-flex justify-content-between align-items-center ${
                  shakeAlert ? "shake" : ""
                }`}
              >
                <div>
                  🔔 <strong>{orderStats.pending}</strong>{" "}
                  orders are pending
                </div>
                <button
                  className={`btn btn-sm btn-${alertType}`}
                  onClick={() => setActiveMenu("orders")}
                >
                  View Orders
                </button>
              </div>
            )}

            {/* ===== DASHBOARD CARDS ===== */}
            <div className="row">
              <div className="col-md-3 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h6>Total Orders</h6>
                    <h3>{orderStats.total}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div
                  className="card shadow-sm border-warning"
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveMenu("orders")}
                >
                  <div className="card-body">
                    <h6>Pending Orders</h6>
                    <h3>{orderStats.pending}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h6>Orders Today</h6>
                    <h3>{orderStats.today}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h6>Last 7 Days</h6>
                    <h3>{orderStats.weekly}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== SHAKE ANIMATION ===== */}
            <style>
              {`
                .shake {
                  animation: shake 0.4s;
                }
                @keyframes shake {
                  0% { transform: translateX(0); }
                  25% { transform: translateX(-4px); }
                  50% { transform: translateX(4px); }
                  75% { transform: translateX(-4px); }
                  100% { transform: translateX(0); }
                }
              `}
            </style>
          </>
        );
    }
  };

  return (
    <div className={`d-flex ${darkMode ? "bg-dark text-white" : ""}`}>
      <Sidebar
        role="admin"
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={onLogout}
      />

      <div className="p-4 w-100 admin-content">
        <div className="content-card">{renderContent()}</div>
      </div>

      {/* ===== COMMAND PALETTE ===== */}
      {showPalette && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.4)", zIndex: 2000 }}
          onClick={() => setShowPalette(false)}
        >
          <div
            className="card shadow-lg"
            style={{ width: 400, margin: "100px auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-body">
              <input
                autoFocus
                placeholder="Type a command..."
                className="form-control mb-3"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {filteredCommands.map((cmd) => (
                <div
                  key={cmd.key}
                  className="p-2 rounded"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setActiveMenu(cmd.key);
                    setShowPalette(false);
                  }}
                >
                  🔎 {cmd.label}
                </div>
              ))}

              {filteredCommands.length === 0 && (
                <small className="text-muted">No command found</small>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
