const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

class Report {
  static async create(reportData, file) {
    // Generate filesystem-safe filename
    const sanitizedTitle = reportData.report_title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 100);
    
    const uniqueId = uuidv4().substring(0, 8);
    const filename = `${sanitizedTitle}_${uniqueId}${path.extname(file.originalname)}`;
    
    const [result] = await pool.query(
      `INSERT INTO reports 
       (patient_id, doctor_id, report_title, filename, date, time, fee_paid)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        reportData.patient_id,
        reportData.doctor_id,
        reportData.report_title,
        filename,
        reportData.date,
        reportData.time,
        reportData.fee_paid
      ]
    );
    
    return { reportId: result.insertId, filename };
  }

  static async findByPatientId(patientId) {
    const [rows] = await pool.query(
      'SELECT r.*, d.doctor_name FROM reports r JOIN doctors d ON r.doctor_id = d.doctor_id WHERE r.patient_id = ?',
      [patientId]
    );
    return rows;
  }

  static async findByDoctorId(doctorId) {
    const [rows] = await pool.query(
      'SELECT r.*, p.patient_name FROM reports r JOIN patients p ON r.patient_id = p.patient_id WHERE r.doctor_id = ?',
      [doctorId]
    );
    return rows;
  }

  static async delete(reportId) {
    const [report] = await pool.query(
      'SELECT filename FROM reports WHERE report_id = ?',
      [reportId]
    );
    
    if (!report.length) return null;
    
    await pool.query('DELETE FROM reports WHERE report_id = ?', [reportId]);
    return report[0].filename;
  }
}

module.exports = Report;