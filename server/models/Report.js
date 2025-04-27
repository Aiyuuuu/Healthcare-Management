const pool = require('../config/db');

class Report {
  static async create(reportData) {

    
    const [result] = await pool.query(
      `INSERT INTO reports 
       (patient_id, doctor_id, report_title, date, time, fee_paid)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        reportData.patient_id,
        reportData.doctor_id,
        reportData.report_title,
        reportData.date,
        reportData.time,
        reportData.fee_paid
      ]
    );
    
    return { reportId: result.insertId };
  }


  static async findByReportId(reportId) {
    const [rows] = await pool.query(
      'SELECT * FROM reports WHERE report_id = ?',
      [reportId]
    );
    return rows[0] || null;
  }

  static async getReportsByPatientId(patientId) {
    const [rows] = await pool.query(
      `
      SELECT
        r.report_id,
        r.report_title,
        r.date,
        r.time,
        p.patient_name,
        r.fee_paid,
        d.hospital_address
      FROM reports AS r
      JOIN patients AS p
        ON r.patient_id = p.patient_id
      JOIN doctors AS d
        ON r.doctor_id = d.doctor_id
      WHERE r.patient_id = ?
      ORDER BY r.date DESC, r.time DESC
      `,
      [patientId]
    );
    return rows;
  }



  static async getReportsByDoctorId(doctorId) {
    const [rows] = await pool.query(
      `
      SELECT
        r.report_id,
        r.report_title,
        r.date,
        r.time,
        p.patient_name,
        r.fee_paid,
        d.hospital_address
      FROM reports AS r
      JOIN patients AS p
        ON r.patient_id = p.patient_id
      JOIN doctors AS d
        ON r.doctor_id = d.doctor_id
      WHERE r.doctor_id = ?
      ORDER BY r.date DESC, r.time DESC
      `,
      [doctorId]
    );
    return rows;
  }


  static async deleteDatabaseEntryByReportId(reportId) {
    if (!reportId) throw new Error('Invalid reportId');
    await pool.query('DELETE FROM reports WHERE report_id = ?', [reportId]);
    return reportId;
  }
}

module.exports = Report;