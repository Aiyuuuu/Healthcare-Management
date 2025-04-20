const Prescription = require('../models/Prescription');

exports.createPrescription = async (req, res) => {
  try {
    const prescriptionData = {
      ...req.body,
      doctor_id: req.user.doctor_id // Set from authenticated doctor
    };
    
    const prescriptionId = await Prescription.create(prescriptionData);
    res.status(201).json({ success: true, prescriptionId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPrescriptionsByAppointment = async (req, res) => {
  try {
    const prescriptions = await Prescription.findByAppointmentId(req.params.appointmentId);
    
    // Verify access
    if (req.role === 'doctor' && prescriptions[0]?.doctor_id !== req.user.doctor_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    if (req.role === 'patient' && prescriptions[0]?.patient_id !== req.user.patient_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({ success: true, data: prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPrescriptionsByPatient = async (req, res) => {
  try {
    // Verify patient is accessing their own prescriptions
    if (parseInt(req.params.patientId) !== req.user.patient_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const prescriptions = await Prescription.findByPatientId(req.params.patientId);
    res.json({ success: true, data: prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPrescriptionsByDoctor = async (req, res) => {
  try {
    // Verify doctor is accessing their own prescriptions
    if (parseInt(req.params.doctorId) !== req.user.doctor_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const prescriptions = await Prescription.findByDoctorId(req.params.doctorId);
    res.json({ success: true, data: prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    
    // Verify prescribing doctor
    if (prescription.doctor_id !== req.user.doctor_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Prescription.update(req.params.id, req.body);
    res.json({ success: true, message: 'Prescription updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    
    // Verify prescribing doctor
    if (prescription.doctor_id !== req.user.doctor_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Prescription.delete(req.params.id);
    res.json({ success: true, message: 'Prescription deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};