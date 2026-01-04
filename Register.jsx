import { useState } from "react";
import { isRegisterValid } from "../../utils/Validation";
import { api } from "../../services/api";

const Register = ({ setPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");

  const [popup, setPopup] = useState({ show: false, msg: "", type: "" });

  const showPopup = (msg, type = "success") => {
    setPopup({ show: true, msg, type });
    setTimeout(() => setPopup({ show: false, msg: "", type: "" }), 2500);
  };

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", {
        email,
        password,
        role,
      });

      showPopup("Registration successful 🎉", "success");
      setTimeout(() => setPage("login"), 1200);
    } catch (err) {
      showPopup(err.response?.data?.message || "Error", "danger");
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="card p-4" style={{ width: 400 }}>
        <h4 className="text-center mb-3">Register</h4>

        {popup.show && (
          <div className={`alert alert-${popup.type}`}>{popup.msg}</div>
        )}

        <input
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <select
          className="form-select mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          className="btn btn-success w-100"
          disabled={!isRegisterValid(email, password, confirmPassword)}
          onClick={handleRegister}
        >
          Register
        </button>

        <div className="text-center mt-3">
          <span>Already have an account? </span>
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => setPage("login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
