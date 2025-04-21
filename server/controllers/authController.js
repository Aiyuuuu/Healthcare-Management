// controllers/authController.js
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Helper function to check email existence
const checkEmailExists = async (email, role) => {
  try {
    const Model = role === 'doctor' ? Doctor : Patient;
    return await Model.findByEmail(email);
  } catch (error) {
    return null;
  }
};

// Patient Registration
exports.registerPatient = async (req, res) => {
  try {
    const { patient_name, email, password, phone_number } = req.body;

    // Validate required fields
    if (!(patient_name && email && password && phone_number)) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Check email uniqueness
    const existingUser = await checkEmailExists(email, 'patient');
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new patient
    const patientId = await Patient.create({
      patient_name,
      email,
      password,
      phone_number
    });

    // Generate JWT
    const token = generateToken(patientId, 'patient');
    
    res.status(201).json({
      success: true,
      token,
      role: 'patient',
      id: patientId,
      name: patient_name
    });

  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Registration failed' 
    });
  }
};

// Doctor Registration
exports.registerDoctor = async (req, res) => {
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
    const requiredFields = [
      'doctor_name', 'email', 'password', 'phone_number', 
      'specialization', 'qualification', 'experience_years',
      'patient_satisfaction_rate', 'avg_time_to_patient',
      'hospital_address', 'doctor_link', 'fee'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Check email uniqueness
    const existingUser = await checkEmailExists(email, 'doctor');
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new doctor
    const doctorId = await Doctor.create({
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
    });

    // Generate JWT
    const token = generateToken(doctorId, 'doctor');
    
    res.status(201).json({
      success: true,
      token,
      role: 'doctor',
      id: doctorId,
      name: doctor_name
    });

  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Registration failed' 
    });
  }
};

// Common Login
exports.login = async (req, res) => {
  try {
    const { email, password, role = 'patient' } = req.body;
    
    // Validate inputs
    if (!(email && password)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    if (!['patient', 'doctor'].includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either "patient" or "doctor"'
      });
    }

    // Get appropriate model
    const Model = role === 'doctor' ? Doctor : Patient;
    const idField = role === 'doctor' ? 'doctor_id' : 'patient_id';

    // Find user by email
    const user = await Model.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(user[idField], role);
    
    res.json({
      success: true,
      token,
      role,
      id: user[idField],
      name: user[`${role}_name`]
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};