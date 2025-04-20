const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) throw new Error('Authentication required');

      // Verify token and extract payload
      const decoded = jwt.verify(token, JWT_SECRET);
      const userRole = decoded.role;
      const userId = decoded.id;

      // Convert allowedRoles to array if it's not already
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      
      // Check if user's role is allowed
      if (!roles.includes(userRole)) {
        throw new Error('Unauthorized access');
      }

      // Determine table and ID field based on user's role
      const table = userRole === 'doctor' ? 'doctors' : 'patients';
      const idField = userRole === 'doctor' ? 'doctor_id' : 'patient_id';

      // Fetch user from appropriate table
      const [user] = await pool.query(
        `SELECT * FROM ${table} WHERE ${idField} = ?`,
        [userId]
      );

      if (!user[0]) throw new Error('User not found');
      
      // Attach user and role to request
      req.user = user[0];
      req.role = userRole;
      next();
    } catch (error) {
      res.status(401).json({ 
        success: false, 
        message: error.message.replace('jwt', 'authentication') 
      });
    }
  };
};

module.exports = {
  authMiddleware,
  generateToken: (id, role) => jwt.sign({ id, role }, JWT_SECRET, { 
    expiresIn: '8h' 
  })
};