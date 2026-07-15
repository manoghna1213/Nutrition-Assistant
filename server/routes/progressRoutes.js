const express = require('express');
const router = express.Router();
const {
  logProgress,
  getProgress,
  updateProgress,
  deleteProgress
} = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { progressValidator } = require('../validations/progressValidator');
const validateFields = require('../middleware/validationMiddleware');

router.route('/')
  .post(protect, authorize('User'), progressValidator, validateFields, logProgress)
  .get(protect, getProgress);

router.route('/:id')
  .put(protect, updateProgress)
  .delete(protect, deleteProgress);

module.exports = router;
