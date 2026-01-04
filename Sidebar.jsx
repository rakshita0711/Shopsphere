import { useState } from "react";
import { getStorage } from "../utils/LocalStorage";

const Sidebar = ({ role, activeMenu, setActiveMenu, onLogout }) => {
  const user = getStorage("user");

  const [openMasters, setOpenMasters] = useState(false);
  const [openBank, setOpenBank] = useState(false);
  const [openCash, setOpenCash] = useState(false);

  const menuClass = (menu) =>
    `nav-link ps-4 ${
      activeMenu === menu ? "text-primary" : "text-white"
    }`;

  return (
    <div
      className="bg-dark text-white vh-100 d-flex flex-column p-3"
      style={{ width: 260 }}
    >
      {/* USER INFO */}
      <div className="mb-4 border-bottom pb-3">
        <h6 className="mb-1">Welcome</h6>
        <strong>{user?.email}</strong>
      </div>

      <ul className="nav flex-column flex-grow-1">
        {/* DASHBOARD */}
        <li
          className={`nav-link ${
            activeMenu === "dashboard" ? "text-primary" : "text-white"
          }`}
          style={{ cursor: "pointer" }}
          onClick={() => {
            setActiveMenu("dashboard");
            setOpenMasters(false);
          }}
        >
          Dashboard
        </li>

        {/* MASTERS */}
        {role === "admin" && (
          <>
            <li
              className="nav-link text-white fw-bold"
              style={{ cursor: "pointer" }}
              onClick={() => setOpenMasters(!openMasters)}
            >
              Masters
            </li>

            {openMasters && (
              <>
                {/* CATEGORY */}
                <li
                  className={menuClass("category")}
                  onClick={() => setActiveMenu("category")}
                >
                  Category
                </li>

                {/* PRODUCT */}
                <li
                  className={menuClass("product")}
                  onClick={() => setActiveMenu("product")}
                >
                  Product
                </li>

                {/* BANK */}
                <li
                  className="nav-link ps-4 text-white fw-semibold"
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpenBank(!openBank)}
                >
                  Bank
                </li>

                {openBank && (
                  <>
                    <li
                      className={menuClass("bank")}
                      onClick={() => setActiveMenu("bank")}
                    >
                      Bank Master
                    </li>

                    <li
                      className={menuClass("bank-account")}
                      onClick={() => setActiveMenu("bank-account")}
                    >
                      Bank Accounts
                    </li>

                    <li
                      className={menuClass("bank-transaction")}
                      onClick={() => setActiveMenu("bank-transaction")}
                    >
                      Bank Transactions
                    </li>
                  </>
                )}

                {/* CASH */}
                <li
                  className="nav-link ps-4 text-white fw-semibold"
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpenCash(!openCash)}
                >
                  Cash
                </li>

                {openCash && (
                  <>
                    <li
                      className={menuClass("cash")}
                      onClick={() => setActiveMenu("cash")}
                    >
                      Cash Master
                    </li>

                    <li
                      className={menuClass("cash-transaction")}
                      onClick={() => setActiveMenu("cash-transaction")}
                    >
                      Cash Transactions
                    </li>
                  </>
                )}

                {/* REPORTS */}
                <li
                  className={menuClass("reports")}
                  onClick={() => setActiveMenu("reports")}
                >
                  Reports
                </li>

                {/* EXPENSES */}
                <li
                  className={menuClass("expenses")}
                  onClick={() => setActiveMenu("expenses")}
                >
                  Expenses
                </li>
                {/* ORDERS */}
                <li
                  className={menuClass("orders")}
                  onClick={() => setActiveMenu("orders")}
                >
                  Orders
                </li>
              </>
            )}
          </>
        )}
      </ul>

      {/* LOGOUT */}
      <button className="btn btn-danger w-100 mt-auto" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
