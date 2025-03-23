import styles from './LandingPage.module.css';

const LandingPage = () => {
    return (
        <div>
            <section id="home" className={styles.landingpg}>
                <div className={styles.content}>
                    <h1 className={styles.firstHeading}>Your Health, Our Priority</h1>
                    <p>Connect with expert doctors, schedule appointments, and manage your health effortlessly.</p>
                    <a href="#services" className={styles.getStartedBtn}>Get Started</a>
                </div>
                <img src="https://i.pinimg.com/736x/78/46/f9/7846f96a1dc39c3284118a2227fe4ef9.jpg" alt="Healthcare illustration" className={styles.image} />
            </section>

            <section id="services" className={styles.services}>
                <h2 className={styles.servicesHeadings}>Our Services</h2>
                <div className={styles.serviceContainer}>
                    <div className={styles.serviceBox}>
                        <h3 className={styles.servicesHeadings}>Online Consultation</h3>
                        <p>Consult with certified doctors anytime, anywhere.</p>
                    </div>
                    <div className={styles.serviceBox}>
                        <h3 className={styles.servicesHeadings}>Appointment Booking</h3>
                        <p>Schedule appointments with just a few clicks.</p>
                    </div>
                    <div className={styles.serviceBox}>
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
                    <input type="text" placeholder="Your Name" required />
                    <input type="email" placeholder="Your Email" required />
                    <textarea placeholder="Your Message" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </section>
        </div>
    );
};

export default LandingPage;
