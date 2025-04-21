const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', patientController.getAllPatients);
router.get('/:id', authMiddleware('patient'), patientController.getPatientById);
router.put('/:id', authMiddleware('patient'), patientController.updatePatient);
router.put('/:id/change-password', authMiddleware('patient'), patientController.changePassword);
router.delete('/:id', authMiddleware('patient'), patientController.deletePatient);

module.exports = router;