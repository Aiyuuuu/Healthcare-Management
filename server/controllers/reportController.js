const Report = require('../models/Report');
const upload = require('../config/fileStorage');
const fs = require('fs');
const path = require('path');

exports.uploadReport = upload.single('pdf');

exports.createReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'PDF file required' 
      });
    }

    const reportData = {
      ...req.body,
      doctor_id: req.user.doctor_id // Set from authenticated doctor
    };

    const { reportId, filename } = await Report.create(reportData, req.file);
    
    const tempPath = req.file.path;
    const newPath = path.join(path.dirname(tempPath), filename);
    fs.renameSync(tempPath, newPath);

    res.status(201).json({ success: true, reportId, filename });
  } catch (error) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReportsByPatient = async (req, res) => {
  try {
    // Verify patient is accessing their own reports
    if (parseInt(req.params.patientId) !== req.user.patient_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const reports = await Report.findByPatientId(req.params.patientId);
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReportsByDoctor = async (req, res) => {
  try {
    // Verify doctor is accessing their own reports
    if (parseInt(req.params.doctorId) !== req.user.doctor_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const reports = await Report.findByDoctorId(req.params.doctorId);
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    // Verify reporting doctor
    if (report.doctor_id !== req.user.doctor_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const filename = await Report.delete(req.params.id);
    const filePath = path.join(process.env.REPORT_STORAGE_PATH, filename);
    
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    
    res.json({ success: true, message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};