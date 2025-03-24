import styles from "./header.module.css";
import { Link } from "react-router-dom";

const Header = () => {
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
        <li>
          <Link to="/Login" className={styles.btn}>
            Login
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
