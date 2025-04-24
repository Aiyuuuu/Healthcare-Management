const Prescription = require("../models/Prescription");
const pool = require("../config/db");

exports.createPrescription = async (req, res) => {
  try {
    const prescriptionData = {
      ...req.body,
    };

    const prescriptionId = await Prescription.create(prescriptionData);
    res.status(201).json({ success: true, prescriptionId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getPrescriptionByAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;

    // Verify appointment exists and get ownership info
    const [appointment] = await pool.query(
      `SELECT patient_id, doctor_id FROM appointments WHERE appointment_id = ?`,
      [appointmentId]
    );

    if (!appointment.length) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Authorization check
    const isPatient =
      req.user.role === "patient" &&
      appointment[0].patient_id === req.user.patient_id;
    const isDoctor =
      req.user.role === "doctor" &&
      appointment[0].doctor_id === req.user.doctor_id;

    if (!isPatient && !isDoctor) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    // Get raw prescription data
    const prescription = await Prescription.findByAppointmentId(appointmentId);

    if (!prescription) {
      return res
        .status(404)
        .json({ success: false, message: "No prescription found" });
    }

    // Only parse medicines JSON if needed
    const responseData = {
      ...prescription,
      end_date: prescription.end_date, // Already formatted as string
      prescription_date: prescription.prescription_date,
      medicines:
        typeof prescription.medicines === "string"
          ? JSON.parse(prescription.medicines)
          : prescription.medicines,
    };

    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPrescriptionsByPatient = async (req, res) => {
  try {
    // Verify patient is accessing their own prescriptions
    if (parseInt(req.params.patientId) !== req.user.patient_id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const prescriptions = await Prescription.findByPatientId(
      req.params.patientId
    );
    res.json({ success: true, data: prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPrescriptionsByDoctor = async (req, res) => {
  try {
    // Verify doctor is accessing their own prescriptions
    if (parseInt(req.params.doctorId) !== req.user.doctor_id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const prescriptions = await Prescription.findByDoctorId(
      req.params.doctorId
    );
    res.json({ success: true, data: prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePrescription = async (req, res) => {
  try {

    // Verify prescribing doctor
    if (!req.user.doctor_id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    await Prescription.update(req.params.id, req.body);
    res.json({ success: true, message: "Prescription updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    // Verify prescribing doctor
    if (prescription.doctor_id !== req.user.doctor_id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Prescription.delete(req.params.id);
    res.json({ success: true, message: "Prescription deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
