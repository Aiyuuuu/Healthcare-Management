import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import styles from './DoctorDashboardPage.module.css';
import { format, isWeekend, addDays } from 'date-fns';
import { CheckCircle, Cancel, Alarm, Assignment, Chat, Description, AccessTime, Today } from '@mui/icons-material';

const DoctorDashboardPage = ({ doctorId }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [appointments, setAppointments] = useState({ 
    today: [], 
    futureSixDays: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const today = new Date();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(`/doctor/${doctorId}/getAppointments`);
        setAppointments({
          today: data?.appointments?.today || [],
          futureSixDays: data?.appointments?.futureSixDays || []
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch appointments. Please try again later.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [doctorId]);

  const handleAppointmentAction = async (action, appointmentId) => {
    if (isWeekend(today)) return;
    
    try {
      await axios.patch(`/doctor/appointments/${appointmentId}`, { action });
      const { data } = await axios.get(`/doctor/${doctorId}/getAppointments`);
      setAppointments({
        today: data?.appointments?.today || [],
        futureSixDays: data?.appointments?.futureSixDays || []
      });
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  const generateFutureDays = () => {
    return Array.from({ length: 6 }).map((_, i) => addDays(today, i + 1));
  };

  const isHoliday = isWeekend(today);

  if (loading) return <div className={styles.loading}>🌀 Loading Appointments...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          className={styles.iconButton}
        >
          <Description /> Add Report
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={styles.iconButton}
        >
          <Chat /> Chat
        </motion.button>
      </div>

      {isHoliday && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.holidayBanner}
        >
          🎉 Today is a Holiday! All functionality is disabled except Add Report.
        </motion.div>
      )}

      <div className={styles.mainContent}>
        <div className={styles.todaySection}>
          <h2 className={styles.sectionTitle}><Today /> Today's Schedule</h2>
          <div className={styles.appointmentColumns}>
            <AppointmentList 
              title="Completed" 
              appointments={appointments.today.filter(a => a.status === 'completed')} 
              type="past" 
              disabled={isHoliday}
              onAction={handleAppointmentAction}
              navigate={navigate}
            />
            <AppointmentList 
              title="In Progress" 
              appointments={appointments.today.filter(a => a.status === 'ongoing')} 
              type="current" 
              disabled={isHoliday}
              onAction={handleAppointmentAction}
              navigate={navigate}
            />
            <AppointmentList 
              title="Upcoming" 
              appointments={appointments.today.filter(a => a.status === 'pending')} 
              type="upcoming" 
              disabled={isHoliday}
              onAction={handleAppointmentAction}
              navigate={navigate}
            />
          </div>
        </div>

        <div className={styles.futureSection}>
          <h2 className={styles.sectionTitle}><AccessTime /> Next 6 Days</h2>
          <div className={styles.daySelector}>
            {generateFutureDays().map((date, i) => {
              const dateString = format(date, 'yyyy-MM-dd');
              const dayAppointments = appointments.futureSixDays.filter(a => a.date === dateString);
              
              return (
                <motion.div 
                  key={dateString}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${styles.dayCard} ${selectedDay === i ? styles.selectedDay : ''}`}
                  onClick={() => !isHoliday && setSelectedDay(i)}
                >
                  <div className={styles.dayName}>{format(date, 'EEE')}</div>
                  <div className={styles.date}>{format(date, 'd')}</div>
                  <div className={styles.apptCount}>
                    {dayAppointments.length}
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {selectedDay !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.dayAppointments}
            >
              {appointments.futureSixDays
                .filter(a => {
                  const selectedDate = format(addDays(today, selectedDay + 1), 'yyyy-MM-dd');
                  return a.date === selectedDate;
                })
                .map(appointment => (
                  <AppointmentCard 
                    key={appointment.id}
                    appointment={appointment}
                    type="upcoming"
                    disabled={isHoliday}
                    onAction={handleAppointmentAction}
                    navigate={navigate}
                  />
                ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const AppointmentList = ({ title, appointments, type, disabled, onAction, navigate }) => (
  <div className={styles.appointmentColumn}>
    <h3 className={styles.columnTitle}>
      {title} 
      <span className={styles.countBadge}>{appointments.length}</span>
    </h3>
    <AnimatePresence>
      {appointments.map(appointment => (
        <AppointmentCard 
          key={appointment.id}
          appointment={appointment}
          type={type}
          disabled={disabled}
          onAction={onAction}
          navigate={navigate}
        />
      ))}
    </AnimatePresence>
  </div>
);

const AppointmentCard = ({ appointment, type, disabled, onAction, navigate }) => {
  const statusColors = {
    completed: '#4CAF50',
    ongoing: '#2196F3',
    pending: '#FF9800',
    missed: '#F44336'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className={styles.appointmentCard}
      style={{ borderLeft: `4px solid ${statusColors[appointment.status] || '#ddd'}` }}
    >
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.patientName}>{appointment.patientName}</div>
          <div className={styles.patientId}>ID: {appointment.patientId}</div>
        </div>
        <div className={styles.timeBadge}>
          <Alarm fontSize="small" /> {appointment.time}
        </div>
      </div>
      <div className={styles.reason}>{appointment.reason}</div>
      
      <div className={styles.actions}>
        {(type === 'current' || type === 'upcoming') && !disabled && (
          <>
            <ActionButton 
              icon={<Cancel />} 
              color="#F44336" 
              onClick={() => onAction('cancel', appointment.id)} 
            />
            {type === 'current' && (
              <>
                <ActionButton 
                  icon={<CheckCircle />} 
                  color="#4CAF50" 
                  onClick={() => onAction('complete', appointment.id)} 
                />
                <ActionButton 
                  icon={<Assignment />} 
                  onClick={() => navigate(`/doctorDashboard/appointment/${appointment.id}/prescription`)}
                />
              </>
            )}
            <ActionButton 
              icon={<Description />} 
              onClick={() => onAction('view', appointment.id)} 
            />
          </>
        )}
        {type === 'past' && !disabled && (
          <>
            <ActionButton 
              icon={<CheckCircle />} 
              color="#4CAF50" 
              onClick={() => onAction('complete', appointment.id)} 
            />
            <ActionButton 
              icon={<Cancel />} 
              color="#F44336" 
              onClick={() => onAction('missed', appointment.id)} 
            />
            <ActionButton 
              icon={<Assignment />} 
              onClick={() => navigate(`/doctorDashboard/appointment/${appointment.id}/prescription`)}
            />
            <ActionButton 
              icon={<Description />} 
              onClick={() => onAction('view', appointment.id)} 
            />
          </>
        )}
      </div>
    </motion.div>
  );
};

const ActionButton = ({ icon, onClick, color = '#666' }) => (
  <motion.button 
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className={styles.actionButton}
    style={{ color }}
    onClick={onClick}
  >
    {icon}
  </motion.button>
);

export default DoctorDashboardPage;