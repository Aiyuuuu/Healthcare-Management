import { useState, useEffect } from "react";
import styles from "./loginPage.module.css";
import useAuthContext from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/ToastNotification/Toast";

const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState("patient");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if(user.role=="patient"||user.role=="doctor"){
      showToast("info", "Already logged in");
      navigate("/");}
      else{logout()}
    }
  }, [user, navigate, logout]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    alert(`Logging in as ${userType}`);
  };

  const handleRegister = (event) => {
    event.preventDefault();
    alert(`Registering as ${userType}`);
  };

  return (
    <div className={styles.container}>
      {isLogin ? (
        <div className={styles.formContainer}>
          <h3 style={{ color: "#566129" }}>Login</h3>
          <form onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Email"
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Password"
                minLength="6"
                maxLength="20"
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
          <span className={styles.toggleLink} onClick={toggleForm}>
            Don't have an account? <b style={{ cursor: "pointer" }}>Sign up</b>
          </span>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <h3 style={{ color: "#566129" }}>Register</h3>
          <form onSubmit={handleRegister}>
            <div className={styles.inputGroup}>
              <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <input type="text" placeholder="Full Name" minLength="2" maxLength="50" required />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Email"
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Password"
                minLength="6"
                maxLength="30"
                autoComplete="new-password"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Phone Number"
                pattern="0[0-9]{9,14}"
                inputMode="numeric"
                maxLength="15"
                value={phoneNumber}
                onChange={(e) => {
                  const sanitizedValue = e.target.value.replace(/\D/g, "").slice(0, 15);
                  setPhoneNumber(sanitizedValue);
                }}
                title="Phone number must start with 0 and be between 10 to 15 digits"
                required
              />
            </div>
            {userType === "doctor" && (
              <>
                <div className={styles.inputGroup}>
                  <input type="text" placeholder="Qualification" maxLength="100" required />
                </div>
                <div className={styles.inputGroup}>
                  <input type="number" placeholder="Years of Experience" min="0" max="40" required />
                </div>
                <div className={styles.inputGroup}>
                  <input type="text" placeholder="Address" maxLength="100" required />
                </div>
              </>
            )}
            <button type="submit">Register</button>
          </form>
          <span className={styles.toggleLink} onClick={toggleForm}>
            Already have an account? <b style={{ cursor: "pointer" }}>Login</b>
          </span>
        </div>
      )}
    </div>
  );
};

export default LoginRegisterPage;
