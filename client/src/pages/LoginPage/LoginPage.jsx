import { useState } from "react";
import styles from "./loginPage.module.css";

const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState("patient");

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
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <input type="email" placeholder="Email" pattern=".+@.+" required />
            </div>
            <div className={styles.inputGroup}>
              <input type="password" placeholder="Password" minLength="6" maxLength="20" required />
            </div>
            <button type="submit">Login</button>
          </form>
          <span className={styles.toggleLink} onClick={toggleForm}>
            Don't have an account? <b style={{ cursor: "pointer" }}>Sign up</b>
          </span>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <h2>Register</h2>
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
              <input type="email" placeholder="Email" pattern=".+@.+" minLength="3" maxLength="50" required />
            </div>
            <div className={styles.inputGroup}>
              <input type="password" placeholder="Password" minLength="6" maxLength="30" required />
            </div>
            <div className={styles.inputGroup}>
            <input 
                    type="text" 
                    placeholder="Phone Number" 
                    pattern="0[0-9]{9,14}" 
                    inputMode="numeric" 
                    maxLength="15"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                      if (e.target.value.length > 15) {
                        e.target.value = e.target.value.slice(0, 15); // Enforce max 15 digits
                      }
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
