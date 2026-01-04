import { useState } from "react";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import { removeStorage } from "./utils/LocalStorage";

function App() {
  const [page, setPage] = useState("login");

  // ✅ LOGOUT HANDLER (IMPORTANT)
  const handleLogout = () => {
    removeStorage("isLoggedIn");
    removeStorage("role");
    removeStorage("user");

    setPage("login"); // redirect to login
  };

  return (
    <>
      {page === "login" && <Login setPage={setPage} />}
      {page === "register" && <Register setPage={setPage} />}

      {page === "user-dashboard" && (
        <UserDashboard setPage={setPage} onLogout={handleLogout} />
      )}

      {page === "admin-dashboard" && (
        <AdminDashboard setPage={setPage} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
