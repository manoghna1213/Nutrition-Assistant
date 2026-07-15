const { check } = require('express-validator');

const progressValidator = [
  check('date', 'Date is required and must be in YYYY-MM-DD format').matches(/^\d{4}-\d{2}-\d{2}$/),
  check('weight', 'Weight must be a positive number').optional().isFloat({ min: 0 }),
  check('caloriesConsumed', 'Calories consumed must be a positive number').optional().isFloat({ min: 0 }),
  check('proteinConsumed', 'Protein consumed must be a positive number').optional().isFloat({ min: 0 }),
  check('carbsConsumed', 'Carbohydrates consumed must be a positive number').optional().isFloat({ min: 0 }),
  check('fatsConsumed', 'Fats consumed must be a positive number').optional().isFloat({ min: 0 }),
  check('waterConsumed', 'Water consumed must be a positive number').optional().isFloat({ min: 0 }),
  check('exercise', 'Exercise must be a positive number representing duration in minutes').optional().isFloat({ min: 0 }),
  check('adherencePercentage', 'Adherence percentage must be a number between 0 and 100').optional().isFloat({ min: 0, max: 100 })
];

module.exports = { progressValidator };
