const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authMiddleware } = require('../middleware/auth');

// Patient registration (no auth needed)
router.post('/', patientController.createPatient);

// Patient views their profile
router.get('/:id', 
  authMiddleware('patient'), 
  patientController.getPatientById
);

// Patient updates their profile
router.put('/:id', 
  authMiddleware('patient'), 
  patientController.updatePatient
);

// Patient deletes their account
router.delete('/:id', 
  authMiddleware('patient'), 
  patientController.deletePatient
);

module.exports = router;