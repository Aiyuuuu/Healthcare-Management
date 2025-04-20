const express = require('express');
const cors = require('cors');
require('dotenv').config();


const cron = require('node-cron');
const pool = require('./config/db');

// Schedule task to run every minute
cron.schedule('* * * * *', async () => {
  try {
    // Update appointments where end time has passed and status isn't missed
    const [result] = await pool.query(`
      UPDATE appointments
      SET status = 'completed'
      WHERE status IN ('pending', 'ongoing')
        AND STR_TO_DATE(
          CONCAT(appointment_date, ' ', 
          SUBSTRING_INDEX(appointment_time, '-', -1)),
          '%Y-%m-%d %h:%i%p'
        ) < NOW()
        AND status <> 'missed'
    `);
    
    if (result.affectedRows > 0) {
      console.log(`Auto-completed ${result.affectedRows} appointments`);
    }
  } catch (error) {
    console.error('Error in appointment cron job:', error);
  }
});



// Import routes
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');

const app = express();


app.use(cors({
  origin: 'http://localhost:5173', // Frontend port
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log('📥 Incoming Request');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

app.use('/api/auth', require('./routes/authRoutes'));



// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'fail', message: 'Internal server error' });
});

module.exports=app