import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; 2025 Your Website. All Rights Reserved.</p>
      <div className={styles.footerLinks}>
        <a href="#">Privacy Policy</a> | 
        <a href="#">Terms of Service</a> | 
        <a href="#">FAQ</a>
      </div>
      <div className={styles.socialMedia}>
        <a href="#">Facebook</a> | 
        <a href="#">Twitter</a> | 
        <a href="#">Instagram</a>
      </div>
    </footer>
  );
}
