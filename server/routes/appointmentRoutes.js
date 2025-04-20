const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authMiddleware } = require('../middleware/auth');

// Patient creates appointment
router.post('/', authMiddleware('patient'), appointmentController.createAppointment);

// Doctor views their appointments
router.get('/doctor/:doctorId', 
  authMiddleware('doctor'), 
  appointmentController.getAppointmentsByDoctor
);

// Patient views their appointments
router.get('/patient/:patientId', 
  authMiddleware('patient'), 
  appointmentController.getAppointmentsByPatient
);

// Doctor updates appointment status
router.put('/:appointmentId/status', 
  authMiddleware('doctor'), 
  appointmentController.updateAppointmentStatus
);

// Doctor/Patient deletes appointment (ownership checked in controller)
router.delete('/:appointmentId', 
  authMiddleware(['doctor', 'patient']), 
  appointmentController.deleteAppointment
);

module.exports = router;