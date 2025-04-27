import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import useThemeContext from "../../hooks/useThemeContext"; 

const Header = () => {
  const { isDark, setIsDark } = useThemeContext(); 
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
          <Link to="/SpecialistCategory">Find Doctors</Link>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
        <li>
          <Link to="/Login" className={styles.btn}>
            Login
          </Link>
        </li>
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

