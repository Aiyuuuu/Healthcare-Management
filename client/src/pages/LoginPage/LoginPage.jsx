import { useState } from "react";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = () => {
    alert("Login function to be implemented");
  };

  const handleRegister = () => {
    alert("Register function to be implemented");
  };

  return (
    <div className={styles.container}>
      {isLogin ? (
        <div className={styles.formContainer}>
          <h2>Login</h2>
          <div className={styles.inputGroup}>
            <select id="user-type">
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <input type="email" placeholder="Email" required />
          </div>
          <div className={styles.inputGroup}>
            <input type="password" placeholder="Password" required />
          </div>
          <button onClick={handleLogin}>Login</button>
          <span className={styles.toggleLink} onClick={toggleForm}>
            Don't have an account? Sign up
          </span>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <h2>Register</h2>
          <div className={styles.inputGroup}>
            <select id="register-user-type">
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <input type="text" placeholder="Full Name" required />
          </div>
          <div className={styles.inputGroup}>
            <input type="email" placeholder="Email" required />
          </div>
          <div className={styles.inputGroup}>
            <input type="password" placeholder="Password" required />
          </div>
          <button onClick={handleRegister}>Register</button>
          <span className={styles.toggleLink} onClick={toggleForm}>
            Already have an account? Login
          </span>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
