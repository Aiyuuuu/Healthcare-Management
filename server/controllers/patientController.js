const Patient = require('../models/Patient');

exports.createPatient = async (req, res) => {
  try {
    const patientId = await Patient.create(req.body);
    res.status(201).json({ success: true, patientId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    // Verify patient is accessing their own profile
    if (parseInt(req.params.id) !== req.user.patient_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const patient = await Patient.findById(req.params.id);
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    // Verify patient is updating their own profile
    if (parseInt(req.params.id) !== req.user.patient_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Patient.update(req.params.id, req.body);
    res.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    // Verify patient is deleting their own account
    if (parseInt(req.params.id) !== req.user.patient_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Patient.delete(req.params.id);
    res.json({ success: true, message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};