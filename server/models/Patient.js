const pool = require('../config/db');

class Patient {
  static async create(patientData) {
    const { patient_name, email, password, phone_number } = patientData;
    const [result] = await pool.query(
      'INSERT INTO patients (patient_name, email, password, phone_number) VALUES (?, ?, ?, ?)',
      [patient_name, email, password, phone_number]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT patient_name, email FROM patients');
    return rows;
  }

  static async findById(patientId) {
    const [rows] = await pool.query('SELECT * FROM patients WHERE patient_id = ?', [patientId]);
    return rows[0];
  }

  static async update(patientId, updateData) {
    const { patient_name, email, phone_number } = updateData;
    await pool.query(
      'UPDATE patients SET patient_name = ?, email = ?, phone_number = ? WHERE patient_id = ?',
      [patient_name, email, phone_number, patientId]
    );
  }

  static async delete(patientId) {
    await pool.query('DELETE FROM patients WHERE patient_id = ?', [patientId]);
  }
}

module.exports = Patient;