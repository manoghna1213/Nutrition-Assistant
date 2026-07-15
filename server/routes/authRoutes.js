const express = require('express');
const router = express.Router();
const { register, login, logout, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } = require('../validations/authValidator');
const validateFields = require('../middleware/validationMiddleware');

router.post('/register', registerValidator, validateFields, register);
router.post('/login', loginValidator, validateFields, login);
router.post('/logout', protect, logout);
router.post('/forgot-password', forgotPasswordValidator, validateFields, forgotPassword);
router.post('/reset-password', resetPasswordValidator, validateFields, resetPassword);

module.exports = router;
