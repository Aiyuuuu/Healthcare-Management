// config/fileStorage.js
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const uploadDir = process.env.REPORT_STORAGE_PATH || './uploads/reports';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // we're setting req.reportId = "<report_id>" in preCreateReport
    const ext  = path.extname(file.originalname) || '.pdf';
    const name = `${String(req.reportId)}${ext}`;
    req.savedFilename = name;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed'), false);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});
