const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res) => {
  try {
    const appointmentData = {
      ...req.body,
      patient_id: req.user.patient_id // Set from authenticated patient
    };
    
    const appointmentId = await Appointment.create(appointmentData);
    res.status(201).json({ success: true, appointmentId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAppointmentsByDoctor = async (req, res) => {
  try {
    // Verify doctor is accessing their own appointments
    if (parseInt(req.params.doctorId) !== req.user.doctor_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const appointments = await Appointment.findByDoctorId(req.params.doctorId);
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAppointmentsByPatient = async (req, res) => {
  try {
    // Verify patient is accessing their own appointments
    if (parseInt(req.params.patientId) !== req.user.patient_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const appointments = await Appointment.findByPatientId(req.params.patientId);
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    
    // Verify treating doctor
    if (appointment.doctor_id !== req.user.doctor_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Appointment.updateStatus(req.params.appointmentId, req.body.status);
    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);

    // Verify ownership
    if (req.role === 'doctor' && appointment.doctor_id !== req.user.doctor_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    if (req.role === 'patient' && appointment.patient_id !== req.user.patient_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Appointment.delete(req.params.appointmentId);
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};