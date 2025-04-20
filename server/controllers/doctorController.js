const Doctor = require('../models/Doctor');

exports.createDoctor = async (req, res) => {
  try {
    const doctorId = await Doctor.create(req.body);
    res.status(201).json({ success: true, doctorId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDoctorsBySpecialization = async (req, res) => {
  try {
    const doctors = await Doctor.findBySpecialization(req.params.specialization);
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    // Verify doctor is updating their own profile
    if (parseInt(req.params.id) !== req.user.doctor_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Doctor.update(req.params.id, req.body);
    res.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    // Verify doctor is deleting their own account
    if (parseInt(req.params.id) !== req.user.doctor_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Doctor.delete(req.params.id);
    res.json({ success: true, message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchDoctors = async (req, res) => {
  try {
    const filters = {
      specialization: req.query.specialization,
      name: req.query.name?.toLowerCase(),
      city: req.query.city,
      experience_start: parseInt(req.query.experience_start) || undefined,
      experience_end: parseInt(req.query.experience_end) || undefined,
      fee_start: parseInt(req.query.fee_start) || undefined,
      fee_end: parseInt(req.query.fee_end) || undefined
    };

    const doctors = await Doctor.search(filters);
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};