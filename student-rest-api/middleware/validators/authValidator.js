const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Institute admin login: POST /v1/institute/user/login
const institutionLoginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation
];

// Super admin login: POST /v1/admin/login
const adminLoginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation
];

// Student login: POST /v1/student/login
const studentLoginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation
];

// Student signup: POST /v1/student/signup
const studentRegisterValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  handleValidation
];

// Forgot password: POST /v1/institute/user/forGotPassword, POST /v1/student/forGotPassword
const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  handleValidation
];

// OTP send: POST /v1/student/sendOTP
const sendOTPValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  handleValidation
];

// OTP verify: POST /v1/student/verifyOTP
const verifyOTPValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('otp').trim().notEmpty().withMessage('OTP is required'),
  handleValidation
];

module.exports = {
  handleValidation,
  institutionLoginValidation,
  adminLoginValidation,
  studentLoginValidation,
  studentRegisterValidation,
  forgotPasswordValidation,
  sendOTPValidation,
  verifyOTPValidation
};
