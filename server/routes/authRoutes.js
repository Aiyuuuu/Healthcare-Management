const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');
const pool = require('../config/db');

// Patient Registration
router.post('/patient/register', async (req, res) => {
  try {
    const { patient_name, email, password, phone_number } = req.body;
    
    // Validate required fields
    if (!(patient_name && email && password && phone_number)) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.query(
      'INSERT INTO patients (patient_name, email, password, phone_number) VALUES (?, ?, ?, ?)',
      [patient_name, email, hashedPassword, phone_number]
    );
    
    const token = generateToken(result.insertId, 'patient');
    res.status(201).json({ 
      success: true, 
      token,
      role: 'patient',
      id: result.insertId
    });

  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.sqlMessage || 'Registration failed' 
    });
  }
});

// Doctor Registration
router.post('/doctor/register', async (req, res) => {
  try {
    const { 
      doctor_name, 
      email, 
      password, 
      phone_number, 
      city, 
      specialization, 
      qualification, 
      experience_years, 
      patient_satisfaction_rate, 
      avg_time_to_patient, 
      hospital_address, 
      doctor_link, 
      fee 
    } = req.body;

    // Validate required fields
    if (!(doctor_name && email && password && phone_number && specialization)) {
      return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.query(
      `INSERT INTO doctors 
      (doctor_name, email, password, phone_number, city, specialization, 
       qualification, experience_years, patient_satisfaction_rate, 
       avg_time_to_patient, hospital_address, doctor_link, fee) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        doctor_name, 
        email, 
        hashedPassword,  // Corrected to use hashed password
        phone_number, 
        city, 
        specialization, 
        qualification, 
        experience_years, 
        patient_satisfaction_rate, 
        avg_time_to_patient, 
        hospital_address, 
        doctor_link, 
        fee
      ]
    );
    
    const token = generateToken(result.insertId, 'doctor');
    res.status(201).json({ 
      success: true, 
      token,
      role: 'doctor',
      id: result.insertId
    });

  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.sqlMessage || 'Registration failed' 
    });
  }
});

// Common Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    if (!(email && password && role)) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const table = role === 'doctor' ? 'doctors' : 'patients';
    const idField = role === 'doctor' ? 'doctor_id' : 'patient_id';

    const [users] = await pool.query(
      `SELECT * FROM ${table} WHERE email = ?`,
      [email]
    );

    if (!users[0]) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const passwordValid = await bcrypt.compare(password, users[0].password);
    if (!passwordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(users[0][idField], role);
    res.json({ 
      success: true, 
      token,
      role,
      id: users[0][idField],
      name: users[0][`${role}_name`]
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;