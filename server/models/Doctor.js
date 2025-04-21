const pool = require("../config/db");
const bcrypt = require('bcryptjs');

class Doctor {
  static async create(doctorData) {
    const {
      doctor_name,
      email,
      password,
      phone_number,
      city,
      specialization,
      qualification,
      experience_years,
      patient_satisfaction_rate,
      avg_time_to_patient,
      hospital_address,
      doctor_link,
      fee,
    } = doctorData;
        const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO doctors (doctor_name, email, password, phone_number, city, specialization, qualification, experience_years, patient_satisfaction_rate, avg_time_to_patient, hospital_address, doctor_link, fee) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        doctor_name,
        email,
        hashedPassword,
        phone_number,
        city,
        specialization,
        qualification,
        experience_years,
        patient_satisfaction_rate,
        avg_time_to_patient,
        hospital_address,
        doctor_link,
        fee,
      ]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.query("SELECT doctor_id, doctor_name, email, phone_number, city, specialization, qualification, experience_years, patient_satisfaction_rate, avg_time_to_patient, hospital_address, doctor_link, fee FROM doctors");
    return rows;
  }

  static async findById(doctorId) {
    const [rows] = await pool.query(
      "SELECT doctor_id, doctor_name, email, phone_number, city, specialization, qualification, experience_years, patient_satisfaction_rate, avg_time_to_patient, hospital_address, doctor_link, fee FROM doctors WHERE doctor_id = ?",
      [doctorId]
    );
    return rows[0];
  }
 
  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM doctors WHERE email = ?', 
      [email]
    );
    return rows[0];
  }

  static async findBySpecialization(specialization) {
    const [rows] = await pool.query(
      "SELECT doctor_id, doctor_name, email, phone_number, city, specialization, qualification, experience_years, patient_satisfaction_rate, avg_time_to_patient, hospital_address, doctor_link, fee FROM doctors WHERE specialization = ?",
      [specialization]
    );
    return rows;
  }
  
  static async update(doctorId, updateData) {
    const validFields = [
      'doctor_name', 'email', 'phone_number', 'city',
      'specialization', 'qualification', 'experience_years',
      'patient_satisfaction_rate', 'avg_time_to_patient',
      'hospital_address', 'doctor_link', 'fee'
    ];
  
    // Get current doctor data
    const currentDoctor = await Doctor.findById(doctorId);
    if (!currentDoctor) throw new Error('Doctor not found');
  
    // Check if email is being changed
    if (updateData.email && updateData.email !== currentDoctor.email) {
      const existingDoctor = await Doctor.findByEmail(updateData.email);
      if (existingDoctor) {
        throw new Error('Email already registered to another doctor');
      }
    }
  
    // Filter out unchanged email
    if (updateData.email === currentDoctor.email) {
      delete updateData.email;
    }
  
    // Build dynamic query
    const setClause = validFields
      .filter(field => updateData[field] !== undefined)
      .map(field => `${field} = ?`)
      .join(', ');
  
    const values = validFields
      .filter(field => updateData[field] !== undefined)
      .map(field => updateData[field]);
  
    if (!setClause) throw new Error('No valid fields to update');
  
    await pool.query(
      `UPDATE doctors SET ${setClause} WHERE doctor_id = ?`,
      [...values, doctorId]
    );
  }

  static async changePassword(doctorId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE doctors SET password = ? WHERE doctor_id = ?',
      [hashedPassword, doctorId]
    );
  }

  static async delete(doctorId) {
    await pool.query("DELETE FROM doctors WHERE doctor_id = ?", [doctorId]);
  }

  static async search(filters) {
    let query = "SELECT * FROM doctors WHERE 1=1";
    const params = [];

    if (filters.specialization) {
      query += " AND specialization = ?";
      params.push(filters.specialization);
    }

    if (filters.name) {
      query += " AND LOWER(doctor_name) LIKE LOWER(?)";
      params.push(`%${filters.name}%`);
    }

    if (filters.city) {
      query += " AND city = ?";
      params.push(filters.city);
    }

    // Experience filter
    if (
      filters.experience_start !== undefined &&
      filters.experience_end !== undefined
    ) {
      query += " AND experience_years BETWEEN ? AND ?";
      params.push(filters.experience_start, filters.experience_end);
    }

    // Fee filter
    if (filters.fee_start !== undefined && filters.fee_end !== undefined) {
      query += " AND fee BETWEEN ? AND ?";
      params.push(filters.fee_start, filters.fee_end);
    }

    if (!params[0]) {
      const doctors = { message: "no filter set, wrong endpoint to get all doctors" };
      return doctors;
    }

    const [doctors] = await pool.query(query, params);
    return doctors;
  }
}

module.exports = Doctor;
