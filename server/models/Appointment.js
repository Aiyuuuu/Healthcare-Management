const pool = require('../config/db');

class Appointment {
  static async create(appointmentData) {
    const { doctor_id, patient_id, appointment_date, appointment_time, appointment_reason, status } = appointmentData;
    const [result] = await pool.query(
      'INSERT INTO appointments (doctor_id, patient_id, appointment_date, appointment_time, appointment_reason, status) VALUES (?, ?, ?, ?, ?, ?)',
      [doctor_id, patient_id, appointment_date, appointment_time, appointment_reason, status || 'pending']
    );
    return result.insertId;
  }

  static async findByDoctorId(doctorId) {
    const [rows] = await pool.query(
      'SELECT a.*, p.patient_name FROM appointments a JOIN patients p ON a.patient_id = p.patient_id WHERE a.doctor_id = ?',
      [doctorId]
    );
    return rows;
  }

  static async findByPatientId(patientId) {
    const [rows] = await pool.query(
      'SELECT a.*, d.doctor_name FROM appointments a JOIN doctors d ON a.doctor_id = d.doctor_id WHERE a.patient_id = ?',
      [patientId]
    );
    return rows;
  }

  static async updateStatus(appointmentId, status) {
    await pool.query(
      'UPDATE appointments SET status = ? WHERE appointment_id = ?',
      [status, appointmentId]
    );
  }

  static async delete(appointmentId) {
    await pool.query('DELETE FROM appointments WHERE appointment_id = ?', [appointmentId]);
  }
}

module.exports = Appointment;