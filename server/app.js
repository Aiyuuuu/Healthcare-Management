const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const cron = require('node-cron');
const pool = require('./config/db');

// Initialize Express app
const app = express();

// ====================== 
//  Security Middlewares
// ======================
app.use(helmet()); // Set secure HTTP headers

const allowedOrigins=[
  'http://localhost:5173',
  'http://192.168.100.4:5173',
  "https://healthcare-management-r7gp.vercel.app/"
]
app.use(cors({
  origin: allowedOrigins, // Frontend origin
  credentials: true // Allow cookies/auth headers
}));

// ======================
//  Body Parsing & JSON
// ======================
app.use(express.json({ limit: '10kb' })); // Limit payload size

// ======================
//  Development Logging
// ======================
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path}`);
    console.log('Body:', req.body);
    next();
  });
}


// ======================
//  Scheduled Tasks
// ======================
cron.schedule('*/30 * * * * *', async () => {
  try {
    // Mark appointments as ongoing when their start time begins
    const [ongoingResult] = await pool.query(`
      UPDATE appointments
      SET status = 'ongoing'
      WHERE status = 'pending'
      AND STR_TO_DATE(
          CONCAT(
              appointment_date, ' ',
              TRIM(SUBSTRING_INDEX(appointment_time, '-', 1))
          ),
          '%Y-%m-%d %h:%i %p'
      ) <= NOW()
      AND STR_TO_DATE(
          CONCAT(
              appointment_date, ' ',
              TRIM(SUBSTRING_INDEX(appointment_time, '-', -1)) 
          ),
          '%Y-%m-%d %h:%i %p'
      ) > NOW()
    `);

    // Mark appointments as completed when their end time passes
    const [completedResult] = await pool.query(`
      UPDATE appointments
      SET status = 'completed'
      WHERE status IN ('ongoing', 'pending')
      AND STR_TO_DATE(
          CONCAT(
              appointment_date, ' ',
              TRIM(SUBSTRING_INDEX(appointment_time, '-', -1)) 
          ),
          '%Y-%m-%d %h:%i %p'
      ) < NOW()
    `);

    // Log results if any changes were made
    if (ongoingResult.affectedRows > 0 || completedResult.affectedRows > 0) {
      console.log(`🕒 Updated appointments - Ongoing: ${ongoingResult.affectedRows}, Completed: ${completedResult.affectedRows}`);
    }
  } catch (error) {
    console.error('❌ Cron job error:', error.message);
  }
});

// ======================
//  Route Configuration
// ======================
// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));

// ======================
//  Health Check Endpoint
// ======================
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: pool._freeConnections.length > 0 ? 'Connected' : 'Disconnected'
  });
});

// ======================
//  Error Handling
// ======================
// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    status: 'fail',
    message: `Can't find ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error Stack:', err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message
  });
});

module.exports = app;