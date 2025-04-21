const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class Patient {
  static async create(patientData) {
    const { patient_name, email, password, phone_number } = patientData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO patients (patient_name, email, password, phone_number) VALUES (?, ?, ?, ?)',
      [patient_name, email, hashedPassword, phone_number]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.query(
      'SELECT patient_id, patient_name, email, phone_number FROM patients'
    );
    return rows;
  }

  static async findById(patientId) {
    const [rows] = await pool.query(
      'SELECT patient_id, patient_name, email, phone_number FROM patients WHERE patient_id = ?',
      [patientId]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM patients WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async update(patientId, updateData) {
    const validFields = ['patient_name', 'email', 'phone_number'];
    const setClause = validFields
      .filter(field => updateData[field])
      .map(field => `${field} = ?`)
      .join(', ');
    
    const values = validFields
      .filter(field => updateData[field])
      .map(field => updateData[field]);

    if (!setClause) throw new Error('No valid fields to update');
    
    await pool.query(
      `UPDATE patients SET ${setClause} WHERE patient_id = ?`,
      [...values, patientId]
    );
  }

  static async changePassword(patientId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE patients SET password = ? WHERE patient_id = ?',
      [hashedPassword, patientId]
    );
  }

  static async delete(patientId) {
    await pool.query('DELETE FROM patients WHERE patient_id = ?', [patientId]);
  }
}

module.exports = Patient;