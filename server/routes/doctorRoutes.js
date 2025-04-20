const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authMiddleware } = require('../middleware/auth');

// Public endpoints
router.get('/search', doctorController.searchDoctors);
router.get('/', doctorController.getAllDoctors);
router.get('/specialization/:specialization', doctorController.getDoctorsBySpecialization);
router.get('/:id', doctorController.getDoctorById);

// Doctor registration (no auth needed)
router.post('/', doctorController.createDoctor);

// Doctor manages their profile
router.put('/:id', 
  authMiddleware('doctor'), 
  doctorController.updateDoctor
);

router.delete('/:id', 
  authMiddleware('doctor'), 
  doctorController.deleteDoctor
);

module.exports = router;