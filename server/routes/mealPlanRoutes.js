const express = require('express');
const router = express.Router();
const {
  createMealPlan,
  getMealPlans,
  updateMealPlan,
  deleteMealPlan
} = require('../controllers/mealPlanController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { mealPlanValidator } = require('../validations/mealValidator');
const validateFields = require('../middleware/validationMiddleware');

router.route('/')
  .post(protect, authorize('Dietitian', 'Admin'), mealPlanValidator, validateFields, createMealPlan)
  .get(protect, getMealPlans);

router.route('/:id')
  .put(protect, authorize('Dietitian', 'Admin'), updateMealPlan)
  .delete(protect, authorize('Dietitian', 'Admin'), deleteMealPlan);

module.exports = router;
