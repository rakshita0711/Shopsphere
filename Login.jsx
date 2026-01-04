import { useState } from "react";
import { isValidEmail, isValidPassword } from "../../utils/Validation";
import { setStorage } from "../../utils/LocalStorage";
import { api } from "../../services/api";

const Login = ({ setPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState({ show: false, msg: "", type: "" });

  const isFormValid = isValidEmail(email) && isValidPassword(password);

  const showPopup = (msg, type = "success") => {
    setPopup({ show: true, msg, type });
    setTimeout(() => setPopup({ show: false, msg: "", type: "" }), 2500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });

      setStorage("isLoggedIn", "true");
      setStorage("role", res.data.user.role);
      setStorage("user", res.data.user);

      showPopup("Login successful ✅", "success");

      setTimeout(() => {
        setPage(
          res.data.user.role === "admin"
            ? "admin-dashboard"
            : "user-dashboard"
        );
      }, 1000);
    } catch (err) {
      showPopup("Invalid email or password ❌", "danger");
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <form className="card p-4" style={{ width: 380 }} onSubmit={handleLogin}>
        <h4 className="text-center mb-3">Login</h4>

        {popup.show && (
          <div className={`alert alert-${popup.type}`}>{popup.msg}</div>
        )}

        <input className="form-control mb-2" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <input type="password" className="form-control mb-3"
          placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="btn btn-primary w-100" disabled={!isFormValid}>
          Login
        </button>
        <div className="text-center mt-3">
  <span>Don’t have an account? </span>
  <button
    type="button"
    className="btn btn-link p-0"
    onClick={() => setPage("register")}
  >
    Register
  </button>
</div>

        
      </form>
    </div>
  );
};

export default Login;
