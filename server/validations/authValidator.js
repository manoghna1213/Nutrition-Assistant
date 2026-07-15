const { check } = require('express-validator');

const registerValidator = [
  check('name', 'Name is required').notEmpty().trim(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('role', 'Invalid role').optional().isIn(['User', 'Dietitian', 'Admin']),
  check('phone', 'Please specify a valid phone number').optional().isString().isLength({ min: 10, max: 15 })
];

const loginValidator = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').exists()
];

const forgotPasswordValidator = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail()
];

const resetPasswordValidator = [
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

module.exports = {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator
};
