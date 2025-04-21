// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Patient Registration
router.post('/patient/register', authController.registerPatient);

// Doctor Registration
router.post('/doctor/register', authController.registerDoctor);

// Login
router.post('/login', authController.login);

module.exports = router;