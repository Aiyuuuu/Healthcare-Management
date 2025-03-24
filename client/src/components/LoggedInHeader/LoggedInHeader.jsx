import { useState, useRef } from "react";
import styles from "./LoggedInHeader.module.css";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuthContext";




const Header = () => {
    const { user, logout } = useAuth() || {};
    const [open, setOpen] = useState(false);
    const buttonRef = useRef(null);

    return (
        <header className={styles.header}>
            <Link to="/" className={styles.logo}>
                HealVerse
            </Link>
            <ul className={styles.navbar}>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <a href="#services">Services</a>
                </li>
                <li>
                    <a href="#doctors.html">Our Doctors</a>
                </li>
                <li>
                    <a href="#contact">Contact</a>
                </li>
                <li className={styles.dropdownContainer}>
                    <button
                        ref={buttonRef}
                        className={styles.dropDownbtn}
                        onClick={() => setOpen(!open)}
                    >
                        {user? user.name.split(" ")[0] : 'USER' } ▼
                    </button>

                    {open && (
                        <div
                            className={styles.dropdownMenu}
                            style={{
                                top: buttonRef.current?.getBoundingClientRect().bottom + "px",
                                left: buttonRef.current?.getBoundingClientRect().left + "px",
                            }}
                        >
                            <Link to="/profile">Profile</Link>
                            <Link to="/prescriptions">prescriptions</Link>
                            <Link to="/appointments">appointments</Link>
                            <Link to="/reports">reports</Link>
                            <Link to="/settings">Settings</Link>
                            <Link to="/help">Help</Link>
                            <button className={styles.logoutBtn} onClick={logout}>Logout</button>
                        </div>
                    )}
                </li>
            </ul>
        </header>
    );
};

export default Header;
