const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/auth');

router.post(
  '/createReportEntry',
  authMiddleware('doctor'),
  reportController.preCreateReport,  // ◀️ insert row + set req.customFilename
);

router.post(
  '/uploadReport/:reportId',
  authMiddleware('doctor'),
  reportController.uploadReport 
);


router.get('/patient',
  authMiddleware('patient'),
  reportController.getReportsListByPatient)

  router.get(
    '/download/:reportId',
    authMiddleware('patient'),
    reportController.downloadReport
  );

router.delete('/:reportId',
  authMiddleware('doctor'),
  reportController.deleteReport
);

module.exports = router;