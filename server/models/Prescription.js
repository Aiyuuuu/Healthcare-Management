const pool = require('../config/db');

class Prescription {
  static async create(prescriptionData) {
    const { prescription_date, prescription_time, medicines, special_instructions } = prescriptionData;
    const [result] = await pool.query(
      'INSERT INTO prescriptions (appointment_id, prescription_date, prescription_time, medicines, special_instructions) VALUES (?, ?, ?, ?, ?)',
      [appointment_id, prescription_date, prescription_time, JSON.stringify(medicines), special_instructions]
    );
    return result.insertId;
  }

  static async findById(prescriptionId){
    const [rows] = await pool.query(
    `SELECT * from prescriptions where prescription_id = ?`, [prescriptionId]
    )
    return rows[0]
  }



  static async findByAppointmentId(appointmentId) {
    const [rows] = await pool.query(
      `SELECT 
        pr.prescription_id,
        pr.duration,
        pr.medicines,
        pr.special_instructions,
        DATE_FORMAT(pr.end_date, '%Y-%m-%d') AS end_date,
        DATE_FORMAT(pr.prescription_date, '%Y-%m-%d') AS prescription_date,
        pr.prescription_time,
        d.doctor_name,
        p.patient_name,
        d.hospital_address
      FROM prescriptions pr
      JOIN appointments a ON pr.appointment_id = a.appointment_id
      JOIN doctors d ON a.doctor_id = d.doctor_id
      JOIN patients p ON a.patient_id = p.patient_id
      WHERE pr.appointment_id = ?`,
      [appointmentId]
    );
    return rows[0];
  }

  static async findByPatientId(patientId) {
    const [rows] = await pool.query(
      `
      SELECT
        pr.prescription_id,
        pr.appointment_id,
        d.doctor_name,
        pr.prescription_date,
        pr.prescription_time,
        pr.duration,
        pr.end_date,
        d.hospital_address
      FROM prescriptions AS pr
      JOIN appointments AS a
        ON pr.appointment_id = a.appointment_id
      JOIN doctors AS d
        ON a.doctor_id = d.doctor_id
      WHERE a.patient_id = ?
      ORDER BY pr.prescription_date DESC, pr.prescription_time DESC
      `,
      [patientId]
    );
    return rows;
  }

  static async findByDoctorId(doctorId) {
    const [rows] = await pool.query(
      `SELECT pr.*, a.appointment_date, a.appointment_time, p.patient_name 
       FROM prescriptions pr 
       JOIN appointments a ON pr.appointment_id = a.appointment_id
       JOIN patients p ON a.patient_id = p.patient_id
       WHERE a.doctor_id = ?`,
      [doctorId]
    );
    return rows;
  }

  static async update(prescriptionId, updateData) {
    const { duration, medicines, special_instructions } = updateData;
    await pool.query(
      `UPDATE prescriptions 
       SET medicines = ?, 
           special_instructions = ?,
           duration = ?
       WHERE prescription_id = ?`,
      [
        JSON.stringify(medicines),
        special_instructions,
        duration,
        prescriptionId
      ]
    );
  }

  static async delete(prescriptionId) {
    await pool.query(
      'DELETE FROM prescriptions WHERE prescription_id = ?',
      [prescriptionId]
    );
  }
}

module.exports = Prescription;