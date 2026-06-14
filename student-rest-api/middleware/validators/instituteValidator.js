const { body, param } = require('express-validator');
const { handleValidation } = require('./authValidator');

// General institute registration: POST /v1/institute
const newInstituteValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Institute name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  handleValidation
];

// Add branch: POST /v1/institute/branch
const addBranchValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Branch name is required'),
  handleValidation
];

// Add learner: POST /v1/institute/learner
const addLearnerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  handleValidation
];

// Add coupon: POST /v1/institute/coupon
const addCouponValidation = [
  body('code').trim().isLength({ min: 2 }).withMessage('Coupon code is required'),
  body('discount').isNumeric().withMessage('Discount must be a number'),
  handleValidation
];

// Send notification: POST /v1/institute/notification
const sendNotificationValidation = [
  body('title').trim().isLength({ min: 2 }).withMessage('Notification title is required'),
  body('message').trim().isLength({ min: 2 }).withMessage('Notification message is required'),
  handleValidation
];

module.exports = {
  newInstituteValidation,
  addBranchValidation,
  addLearnerValidation,
  addCouponValidation,
  sendNotificationValidation
};
