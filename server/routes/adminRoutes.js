const express = require('express');
const router = express.Router();
const { getDashboardStats, updateUserRole } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Admin'));

router.get('/dashboard', getDashboardStats);
router.put('/users/:id', updateUserRole);

module.exports = router;
