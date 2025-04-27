import { useState, useEffect } from "react";
import styles from "./LoginPage.module.css";
import useAuthContext from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/ToastNotification/Toast";
import api from "../../services/api";

const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState("patient");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
    city: "",
    hospitalAddress: "",
    avgTime: "",
    satisfactionRate: "",
    profileLink: "",
    fee: ""
  });
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && ["patient", "doctor"].includes(user.role)) {
      showToast("info", "Already logged in");
      navigate("/");
    }
  }, [user, navigate]);

  const toggleForm = () => setIsLogin(!isLogin);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 15);
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    try {
      // Use the context’s login method
      const { success, message } = await login(
        formData.email,
        formData.password,
        userType
      );
  
      if (!success) {
        showToast("error", message);
        return;
      }
  
      showToast("success", "Login successful!");
      navigate(userType === "doctor" ? "/doctor/dashboard" : "/");
    } catch (error) {
      // Should rarely hit this, since login() handles failures
      showToast("error", "Unexpected error during login");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const endpoint = `/api/auth/${userType}/register`;
      const body = {
        [userType === "patient" ? "patient_name" : "doctor_name"]: formData.name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone,
        ...(userType === "doctor" && {
          city: formData.city,
          specialization: formData.specialization,
          qualification: formData.qualification,
          experience_years: formData.experience,
          patient_satisfaction_rate: formData.satisfactionRate,
          avg_time_to_patient: formData.avgTime,
          hospital_address: formData.hospitalAddress,
          doctor_link: formData.profileLink,
          fee: formData.fee
        })
      };

      const response = await api.post(endpoint, body);
      const { token, role, id, name } = response.data;
      login({ token, role, id, name });
      showToast("success", "Registration successful!");
      navigate(role === "doctor" ? "/doctor/dashboard" : "/");

    } catch (error) {
      showToast("error", error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {isLogin ? (
        <div className={styles.formContainer}>
          <h3 style={{ color: "#566129" }}>Login</h3>
          <form onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <select 
                value={userType} 
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                minLength="6"
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <span className={styles.toggleLink} onClick={toggleForm}>
            Don't have an account? <b>Sign up</b>
          </span>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <h3 style={{ color: "#566129" }}>Register</h3>
          <form onSubmit={handleRegister}>
            <div className={styles.inputGroup}>
              <select 
                value={userType} 
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                minLength="6"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                pattern="0[0-9]{9,14}"
                required
              />
            </div>
            {userType === "doctor" && (
              <>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="specialization"
                    placeholder="Specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="qualification"
                    placeholder="Qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="number"
                    name="experience"
                    placeholder="Years of Experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="hospitalAddress"
                    placeholder="Hospital Address"
                    value={formData.hospitalAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="number"
                    name="avgTime"
                    placeholder="Avg Time per Patient (mins)"
                    value={formData.avgTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="number"
                    name="satisfactionRate"
                    placeholder="Satisfaction Rate (%)"
                    value={formData.satisfactionRate}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="url"
                    name="profileLink"
                    placeholder="Profile Link"
                    value={formData.profileLink}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="number"
                    name="fee"
                    placeholder="Fee (PKR)"
                    value={formData.fee}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            )}
            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <span className={styles.toggleLink} onClick={toggleForm}>
            Already have an account? <b>Login</b>
          </span>
        </div>
      )}
    </div>
  );
};

export default LoginRegisterPage;
