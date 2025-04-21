const Patient = require('../models/Patient');
const bcrypt = require('bcryptjs')

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
    if (parseInt(req.params.id) !== req.user.patient_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.user.patient_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Patient.update(req.params.id, req.body);
    const updatedPatient = await Patient.findById(req.params.id);
    res.json({ success: true, data: updatedPatient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const patient = await Patient.findByEmail(req.user.email);
    
    const isValid = await bcrypt.compare(oldPassword, patient.password);
    if (!isValid) throw new Error('Invalid current password');

    await Patient.changePassword(req.user.patient_id, newPassword);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.user.patient_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Patient.delete(req.params.id);
    res.json({ success: true, message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};