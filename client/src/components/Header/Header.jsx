import React from "react";
import styles from "./header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <a href="indexproject.html" className={styles.logo}>
        HealVerse
      </a>
      <ul className={styles.navbar}>
        <li>
          <a href="#home">Home</a>
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
          <a href="login.html" className={styles.btn}>
            Login
          </a>
        </li>
      </ul>
    </header>
  );
};

export default Header;
