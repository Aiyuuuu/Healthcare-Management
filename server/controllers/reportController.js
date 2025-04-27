const Report = require("../models/Report");
const fs = require("fs");
const path = require("path");
const upload = require("../config/fileStorage");

exports.preCreateReport = async (req, res) => {
  try {
    const { patientId, title, feePaid } = req.body;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;
    
    const time = now.toTimeString().split(' ')[0];

    
    const { reportId } = await Report.create({
      patient_id: parseInt(patientId, 10),
      doctor_id: req.user.doctor_id,
      report_title: title.trim(),
      date,
      time,
      fee_paid: parseInt(feePaid, 10),
    });
    console.log(reportId);

    res.status(201).json({ success: true, reportId });
  } catch (err) {
    console.error("preCreateReport error:", err);
    res
      .status(500)
      .json({ success: false, message: "Could not create report entry." });
  }
};

exports.uploadReport = (req, res) => {
  req.reportId = req.params.reportId;
  upload.single("pdf")(req, res, async (err) => {
    if (err) {
      Report.deleteDatabaseEntryByReportId(req.params.reportId);
      console.error("uploadReport multer error:", err);
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const reportId = req.params.reportId;
      return res.status(201).json({
        success: true,
        reportId,
        filename: req.savedFilename,
      });
    } catch (e) {
      console.error("uploadReport error:", e);
      Report.deleteDatabaseEntryByReportId(req.params.reportId);
      return res
        .status(500)
        .json({ success: false, message: "Could not upload report." });
    }
  });
};

exports.getReportsListByPatient = async (req, res) => {
  function formatTimeToAMPM(time24) {
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // convert 0 to 12
    return `${hour}:${minute} ${ampm}`;
  }

  function formatDate(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  if (!req.user.patient_id) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }
  try {
    const reports = await Report.getReportsByPatientId(req.user.patient_id);

    const formattedReports = reports.map((report) => ({
      ...report,
      date: formatDate(new Date(report.date)),   // 🛠 fix the date
      time: formatTimeToAMPM(report.time),        // 🛠 fix the time
    }));

    res.json({ success: true, data: formattedReports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.downloadReport = async (req, res) => {
  try {
    const reportId = parseInt(req.params.reportId, 10);

    // 1️⃣ Load the report row
    const report = await Report.findByReportId(reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    // 2️⃣ Authorize: must belong to this patient
    if (report.patient_id !== req.user.patient_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // 3️⃣ Locate the file
    const uploadDir = process.env.REPORT_STORAGE_PATH 
      || path.join(__dirname, '..', 'uploads', 'reports');
    const filename  = `${reportId}.pdf`;
    const filePath  = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found on server.' });
    }

    // 4️⃣ Stream it down
    return res.download(filePath, filename, (err) => {
      if (err) {
        console.error('downloadReportPatient error:', err);
        // headers may already have been sent
      }
    });

  } catch (error) {
    console.error('downloadReportPatient error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};


exports.deleteReport = async (req, res) => {
  try {
    const reportId = parseInt(req.params.reportId, 10);

    // 1️⃣ Fetch the report to verify ownership
    const report = await Report.findByReportId(reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }
    if (report.doctor_id !== req.user.doctor_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // 2️⃣ Delete the database entry
    await Report.deleteDatabaseEntryByReportId(reportId);

    // 3️⃣ Remove the PDF file from disk
    const uploadDir = process.env.REPORT_STORAGE_PATH || './uploads/reports';
    const filePath = path.join(uploadDir, `${reportId}.pdf`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 4️⃣ Respond success
    return res.json({ success: true, message: 'Report deleted.' });
  } catch (error) {
    console.error('deleteReport error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
