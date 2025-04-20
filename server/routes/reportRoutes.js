const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/auth');

// Upload new report (doctor only)
router.post('/',
  authMiddleware('doctor'),
  reportController.uploadReport,
  reportController.createReport
);

// Get reports by patient
router.get('/patient/:patientId',
  authMiddleware('patient'),
  reportController.getReportsByPatient
);

// Get reports by doctor
router.get('/doctor/:doctorId',
  authMiddleware('doctor'),
  reportController.getReportsByDoctor
);

// Delete report (doctor only)
router.delete('/:id',
  authMiddleware('doctor'),
  reportController.deleteReport
);

module.exports = router;