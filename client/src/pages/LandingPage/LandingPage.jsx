import styles from './LandingPage.module.css';
import useAuthContext from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { showToast } from "../../components/ToastNotification/Toast"; 

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext(); // Get auth status

    const handleGetStarted = () => {
        if (user) {
            if (user.role === 'patient') {
                navigate("/patientDashboard");
            } else if (user.role === 'doctor') {
                navigate("/doctorDashboard");
            } else {
                showToast("error", "User role is incorrect or missing");
            }
        } else {
            navigate("/Login");
        }
    };

    const navigateToService = (path) => {
        if (user?.role === 'patient') {
            navigate(path);
        } else {
            showToast("info", "Please log in as a patient");
            navigate("/Login");
        }
    };

    return (
        <div className={styles.pageContainer}>
            <section id="home" className={styles.landingpg}>
                <div className={styles.content}>
                    <h1 className={styles.firstHeading}>Your Health, Our Priority</h1>
                    <p>Connect with expert doctors, schedule appointments, and manage your health effortlessly.</p>
                    <a onClick={handleGetStarted} className={styles.getStartedBtn}>Get Started</a>
                </div>
                <img src="/assets/LandingPage/healthcare-illustration.jpg" alt="Healthcare illustration" className={styles.image} />
            </section>

            <section id="services" className={styles.services}>
                <h2 className={styles.servicesHeadings}>Our Services</h2>
                <div className={styles.serviceContainer}>
                    <div className={styles.serviceBox} onClick={() => navigateToService("/SpecialistCategory")}>
                        <h3 className={styles.servicesHeadings}>Online Consultation</h3>
                        <p>Consult with certified doctors anytime, anywhere.</p>
                    </div>
                    <div className={styles.serviceBox} onClick={() => navigateToService("/SpecialistCategory")}>
                        <h3 className={styles.servicesHeadings}>Appointment Booking</h3>
                        <p>Schedule appointments with just a few clicks.</p>
                    </div>
                    <div className={styles.serviceBox} onClick={() => navigateToService("/patientDashboard")}>
                        <h3 className={styles.servicesHeadings}>Health Records</h3>
                        <p>Securely store and access your medical history.</p>
                    </div>
                </div>
            </section>

            <section id="testimonials" className={styles.testimonials}>
                <h2>What Our Users Say</h2>
                <div className={styles.testimonialContainer}>
                    <div className={styles.testimonial}>
                        <p>"HealVerse made healthcare so easy! Highly recommended."</p>
                        <h4>- Maryiam Hassan</h4>
                    </div>
                    <div className={styles.testimonial}>
                        <p>"Booking appointments has never been this convenient!"</p>
                        <h4>- Imran Khan</h4>
                    </div>
                    <div className={styles.testimonial}>
                        <p>"Exceeded my expectations. Will come back again!"</p>
                        <h4>- Emily Johnson</h4>
                    </div>
                    <div className={styles.testimonial}>
                        <p>"Fantastic support and results. Truly the best."</p>
                        <h4>- Michael Brown</h4>
                    </div>
                </div>
            </section>

            <section id="contact" className={styles.contact}>
                <h2>Contact Us</h2>
                <form>
                    <input id="name" type="text" placeholder="Enter your name" required />

                    <input id="email" type="email" placeholder="Enter your email" required />

                    <textarea id="message" placeholder="Enter your message" required></textarea>

                    <button type="submit">Send Message</button>
                </form>
            </section>
        </div>
    );
};

export default LandingPage;
