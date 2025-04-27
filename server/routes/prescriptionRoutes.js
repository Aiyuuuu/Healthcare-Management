const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { authMiddleware } = require('../middleware/auth');

// Doctor creates prescription
router.post('/', 
  authMiddleware('doctor'), 
  prescriptionController.createPrescription
);

// View prescriptions by appointment (doctor/patient)
router.get('/appointment/:appointmentId', 
  authMiddleware(['doctor', 'patient']), 
  prescriptionController.getPrescriptionByAppointment
);

// Patient views their prescriptions
router.get('/patient', 
  authMiddleware('patient'), 
  prescriptionController.getPrescriptionsListByPatient
);

// Doctor views their prescriptions
router.get('/doctor', 
  authMiddleware('doctor'), 
  prescriptionController.getPrescriptionsByDoctor
);

// Doctor updates prescription
router.put('/:id', 
  authMiddleware('doctor'), 
  prescriptionController.updatePrescription
);

// Doctor deletes prescription
router.delete('/:id', 
  authMiddleware('doctor'), 
  prescriptionController.deletePrescription
);

module.exports = router;