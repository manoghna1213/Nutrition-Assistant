const { check } = require('express-validator');

const mealPlanValidator = [
  check('clientId', 'Client ID must be a valid Mongo ID').isMongoId(),
  check('breakfast', 'Breakfast details are required').notEmpty().trim(),
  check('lunch', 'Lunch details are required').notEmpty().trim(),
  check('dinner', 'Dinner details are required').notEmpty().trim(),
  check('calories', 'Calories must be a positive number').isFloat({ min: 0 }),
  check('protein', 'Protein must be a positive number').optional().isFloat({ min: 0 }),
  check('carbohydrates', 'Carbohydrates must be a positive number').optional().isFloat({ min: 0 }),
  check('fats', 'Fats must be a positive number').optional().isFloat({ min: 0 }),
  check('fiber', 'Fiber must be a positive number').optional().isFloat({ min: 0 }),
  check('waterGoal', 'Water goal must be a positive number').optional().isFloat({ min: 0 }),
  check('notes', 'Notes must be a string').optional().isString()
];

module.exports = { mealPlanValidator };
