import styles from "./PatientDashboardPage.module.css"; // ✅ Fixed spelling
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthContext from "../../hooks/useAuthContext";
import { showToast } from "../../components/ToastNotification/Toast";

const PatientDashboardPage = () => { // ✅ Fixed spelling
    const navigate = useNavigate();
    const { user } = useAuthContext();

    useEffect(() => {
        if (!user) {
            showToast("info", "Login first");
            navigate("/Login");
        } else if (user.role !== 'patient') {
            showToast("error", "Login as a patient");
            navigate("/");
        }
    }, [user, navigate]);

    if (!user || user.role !== 'patient') return null; // Prevent rendering while redirecting

    return (
        <div className={styles.pageContainer}>
            <header className={styles.subHeader}>
                <h2>What Brings You Here Today?</h2>
            </header>

            <div className={styles.container}>
                <div className={styles.options}>
                    <button className={styles.optionButton} onClick={() => navigate('/SpecialistCategory')}>
                        <img src="/assets/patientDashboardPage/booking.webp" alt="Appointment Booking" />
                        <p>Appointment Booking</p>
                    </button>
                    <button className={styles.optionButton} onClick={() => navigate('/patient/appointments')}>
                        <img src="/assets/patientDashboardPage/appointment.webp" alt="Your Appointments" />
                        <p>Your Appointments</p>
                    </button>
                    <button className={styles.optionButton} onClick={() => navigate("/patient/reports")}>
                        <img src="/assets/patientDashboardPage/reports.png" alt="Medical Reports" />
                        <p>Medical Reports</p>
                    </button>
                    <button className={styles.optionButton} onClick={() => navigate("/patient/prescriptions")}>
                        <img src="/assets/patientDashboardPage/prescription.webp" alt="Prescriptions" />
                        <p>Prescriptions</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboardPage; // ✅ Fixed spelling
