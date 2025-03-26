import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuthContext";
import useThemeContext from "../../hooks/useThemeContext"; // ✅ Import theme context
import styles from "./patientHeader.module.css";

const Header = () => {
    const { user, logout } = useAuth() || {};
    const { isDark, setIsDark } = useThemeContext(); // ✅ Access theme state
    const [open, setOpen] = useState(false);
    const buttonRef = useRef(null);

    return (
        <header className={styles.header} onMouseLeave={() => setOpen(false)}>
            <Link to="/" className={styles.logo}>
                HealVerse
            </Link>
            <ul className={styles.navbar}>
                <li><Link to="/">Home</Link></li>
                <li><a href="#services">Services</a></li>
                <li><Link to="/SpecialistCategory">Find Doctors</Link></li>
                <li><a href="/patientDashboard">Dashboard</a></li>

                {/* Dropdown */}
                <li className={styles.dropdownContainer}>
                    <button
                        ref={buttonRef}
                        className={styles.dropDownbtn}
                        onClick={() => setOpen(!open)}
                    >
                        {user ? user.name.split(" ")[0] : "USER"} ▼
                    </button>

                    {open && (
                        <div
                            className={styles.dropdownMenu}
                            style={{
                                top: buttonRef.current?.getBoundingClientRect().bottom + "px",
                                left: buttonRef.current?.getBoundingClientRect().left + "px",
                            }}
                        >
                            <Link to="/prescriptions">Prescriptions</Link>
                            <Link to="/appointments">Appointments</Link>
                            <Link to="/reports">Reports</Link>
                            <Link to="/help">Help</Link>
                            <button className={styles.logoutBtn} onClick={logout}>Logout</button>
                        </div>
                    )}
                </li>

                {/* Theme Toggle Button */}
                <li>
                    <button className={styles.themeToggle} onClick={() => setIsDark(!isDark)}>
                        {isDark ? "☀️" : "🌙"}
                    </button>
                </li>
            </ul>
        </header>
    );
};

export default Header;

