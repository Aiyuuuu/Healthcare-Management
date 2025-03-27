import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import useThemeContext from "../../hooks/useThemeContext"; // ✅ Import theme context
import styles from "./doctorHeader.module.css";

const DoctorHeader = () => {
    const { user, logout } = useAuthContext() || {};
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
                <li><a href="/doctorDashboard">Dashboard</a></li>

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
                            <Link to="/doctorDashboard">Dashboard</Link>
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

export default DoctorHeader;

