const pool = require("../config/db");

class Appointment {
  static async create(appointmentData) {
    const {
      doctor_id,
      patient_id,
      appointment_date,
      appointment_time,
      appointment_reason,
      status,
    } = appointmentData;

    try {
      // Check for existing appointment first
      const [existingDoctor] = await pool.query(
        `SELECT appointment_id FROM appointments 
        WHERE doctor_id = ? 
        AND appointment_date = ? 
        AND appointment_time = ?`,
        [doctor_id, appointment_date, appointment_time]
      );

      const [existingPatient] = await pool.query(
        `SELECT appointment_id FROM appointments 
        WHERE patient_id = ? 
        AND appointment_date = ? 
        AND appointment_time = ?`,
        [patient_id, appointment_date, appointment_time]
      );

      if (existingDoctor.length > 0) {
        const error = new Error("Time slot already booked for this doctor");
        error.code = "TIME_SLOT_CONFLICT";
        throw error;
      }

      if (existingPatient.length > 0) {
        const error = new Error(
          "You already booked this time slot in another appointment"
        );
        error.code = "TIME_SLOT_CONFLICT";
        throw error;
      }

      const [result] = await pool.query(
        `INSERT INTO appointments 
        (doctor_id, patient_id, appointment_date, appointment_time, appointment_reason, status) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          doctor_id,
          patient_id,
          appointment_date,
          appointment_time,
          appointment_reason,
          status || "pending",
        ]
      );

      return result.insertId;
    } catch (err) {
      // Handle MySQL duplicate entry error (ER_DUP_ENTRY)
      if (err.code === "ER_DUP_ENTRY") {
        const error = new Error(
          "This time slot is already booked for the doctor"
        );
        error.code = "TIME_SLOT_CONFLICT";
        throw error;
      }
      throw err;
    }
  }
  static async findByAppointmentId(appointmentId) {
    const [rows] = await pool.query(
      `SELECT * FROM appointments where appointment_id = ?`,
      [appointmentId]
    );
    return rows[0];
  }

  // In models/Appointment.js
  static async findTodayAppointmentsByDoctorId(doctorId) {
    const [rows] = await pool.query(
      `SELECT 
      a.appointment_id,
      a.patient_id,
      p.patient_name,
      a.appointment_reason as reason,
      a.appointment_time as time,
      a.status,
      pr.prescription_id
    FROM appointments a
    JOIN patients p ON a.patient_id = p.patient_id
    LEFT JOIN prescriptions pr ON a.appointment_id = pr.appointment_id
    WHERE a.doctor_id = ? 
      AND a.appointment_date = CURDATE()
    ORDER BY a.appointment_time`,
      [doctorId]
    );

    return rows.map((row) => ({
      appointment_id: row.appointment_id.toString(),
      patient_id: row.patient_id.toString(),
      patient_name: row.patient_name,
      reason: row.reason,
      time: row.time,
      status: row.status,
      pres: row.prescription_id || null,
    }));
  }

  static async findNext6DaysAppointmentsByDoctorId(doctorId) {
    const [rows] = await pool.query(
      `SELECT 
      a.appointment_id,
      a.patient_id,
      p.patient_name,
      a.appointment_reason as reason,
      DATE_FORMAT(a.appointment_date, '%Y-%m-%d') as date,
      a.appointment_time as time,
      a.status,
      pr.prescription_id
    FROM appointments a
    JOIN patients p ON a.patient_id = p.patient_id
    LEFT JOIN prescriptions pr ON a.appointment_id = pr.appointment_id
    WHERE a.doctor_id = ? 
      AND a.appointment_date BETWEEN CURDATE() + INTERVAL 1 DAY AND CURDATE() + INTERVAL 7 DAY
    ORDER BY a.appointment_date, a.appointment_time`,
      [doctorId]
    );

    return rows.map((row) => ({
      appointment_id: row.appointment_id.toString(),
      patient_id: row.patient_id.toString(),
      patient_name: row.patient_name,
      reason: row.reason,
      date: row.date,
      time: row.time,
      status: row.status,
      pres: row.prescription_id || null,
    }));
  }

  static async findByPatientId(patientId) {
    const [rows] = await pool.query(
      `SELECT 
        a.appointment_id,
        a.doctor_id,
        a.patient_id,
        DATE_FORMAT(a.appointment_date, '%Y-%m-%d') as appointment_date,
        a.appointment_time,
        a.appointment_reason,
        a.status,
        DATE_FORMAT(a.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        d.doctor_name,
        p.patient_name,
        d.specialization,
        d.fee,
        d.hospital_address
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.doctor_id
      JOIN patients p ON a.patient_id = p.patient_id
      WHERE a.patient_id = ?`,
      [patientId]
    );
    return rows;
  }

  static async updateStatus(appointmentId, status) {
    await pool.query(
      `UPDATE appointments 
      SET status = ? 
      WHERE appointment_id = ?`,
      [status, appointmentId]
    );
  }

  static async delete(appointmentId) {
    await pool.query(
      `DELETE FROM appointments 
      WHERE appointment_id = ?`,
      [appointmentId]
    );
  }


  static async getBookedSlotsByDoctorId(doctorId) {
    const [rows] = await pool.query(
      `SELECT DATE_FORMAT(appointment_date, '%Y-%m-%d') as formatted_date, appointment_time 
       FROM appointments 
       WHERE doctor_id = ? 
       ORDER BY appointment_date, appointment_time`,
      [doctorId]
    );

    const bookedSlots = {};
    rows.forEach(({ formatted_date, appointment_time }) => {
      if (!bookedSlots[formatted_date]) {
        bookedSlots[formatted_date] = [];
      }
      bookedSlots[formatted_date].push(appointment_time);
    });

    return bookedSlots;
  }
}

module.exports = Appointment;
