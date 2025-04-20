const pool = require("../config/db");

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
      hospital_address,
      fee,
    } = doctorData;
    const [result] = await pool.query(
      "INSERT INTO doctors (doctor_name, email, password, phone_number, city, specialization, qualification, experience_years, hospital_address, fee) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        doctor_name,
        email,
        password,
        phone_number,
        city,
        specialization,
        qualification,
        experience_years,
        hospital_address,
        fee,
      ]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.query("SELECT * FROM doctors");
    return rows;
  }

  static async findById(doctorId) {
    const [rows] = await pool.query(
      "SELECT * FROM doctors WHERE doctor_id = ?",
      [doctorId]
    );
    return rows[0];
  }

  static async findBySpecialization(specialization) {
    const [rows] = await pool.query(
      "SELECT * FROM doctors WHERE specialization = ?",
      [specialization]
    );
    return rows;
  }

  static async update(doctorId, updateData) {
    const {
      doctor_name,
      email,
      phone_number,
      city,
      specialization,
      qualification,
      experience_years,
      hospital_address,
      fee,
    } = updateData;
    await pool.query(
      "UPDATE doctors SET doctor_name = ?, email = ?, phone_number = ?, city = ?, specialization = ?, qualification = ?, experience_years = ?, hospital_address = ?, fee = ? WHERE doctor_id = ?",
      [
        doctor_name,
        email,
        phone_number,
        city,
        specialization,
        qualification,
        experience_years,
        hospital_address,
        fee,
        doctorId,
      ]
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
