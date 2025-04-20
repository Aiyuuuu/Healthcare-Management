const pool = require('../config/db');

class Prescription {
  static async create(prescriptionData) {
    const { appointment_id, prescription_date, prescription_time, medicines, special_instructions } = prescriptionData;
    const [result] = await pool.query(
      'INSERT INTO prescriptions (appointment_id, prescription_date, prescription_time, medicines, special_instructions) VALUES (?, ?, ?, ?, ?)',
      [appointment_id, prescription_date, prescription_time, JSON.stringify(medicines), special_instructions]
    );
    return result.insertId;
  }

  static async findByAppointmentId(appointmentId) {
    const [rows] = await pool.query(
      'SELECT p.*, a.patient_id, a.doctor_id FROM prescriptions p JOIN appointments a ON p.appointment_id = a.appointment_id WHERE p.appointment_id = ?',
      [appointmentId]
    );
    return rows;
  }

  static async findByPatientId(patientId) {
    const [rows] = await pool.query(
      `SELECT pr.*, a.appointment_date, a.appointment_time, d.doctor_name 
       FROM prescriptions pr 
       JOIN appointments a ON pr.appointment_id = a.appointment_id
       JOIN doctors d ON a.doctor_id = d.doctor_id
       WHERE a.patient_id = ?`,
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
    const { prescription_date, prescription_time, medicines, special_instructions } = updateData;
    await pool.query(
      `UPDATE prescriptions 
       SET prescription_date = ?, 
           prescription_time = ?, 
           medicines = ?, 
           special_instructions = ?
       WHERE prescription_id = ?`,
      [
        prescription_date,
        prescription_time,
        JSON.stringify(medicines),
        special_instructions,
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