import styles from "./PatientDashbaordPage.module.css";
import { useNavigate } from 'react-router-dom';

const PatientDashbaordPage = () => {
    const navigate = useNavigate();
  return (
    <div className={styles.pageContainer}>
      <header className={styles.subHeader}>
        <h2>What Brings You Here Today?</h2>
      </header>

      <div className={styles.container}>
        <div className={styles.options}>
          <button className={styles.optionButton} onClick={()=>navigate('/SpecialistCategory')}>
            <img src="/assets/patientDashboardPage/booking.webp" alt="Appointment Booking" />
            <p>Appointment Booking</p>
          </button>
          <button className={styles.optionButton} onClick={() => navigate('/appointments')}>
            <img src="/assets/patientDashboardPage/appointment.webp" alt="Your Appointments" />
            <p>Your Appointments</p>
          </button>
          <button className={styles.optionButton} onClick={() => navigate("/reports")}>
            <img src="/assets/patientDashboardPage/reports.png" alt="Medical Reports" />
            <p>Medical Reports</p>
          </button>
          <button className={styles.optionButton} onClick={() => navigate("/prescriptions")}>
            <img src="/assets/patientDashboardPage/prescription.webp" alt="Prescriptions" />
            <p>Prescriptions</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashbaordPage;
