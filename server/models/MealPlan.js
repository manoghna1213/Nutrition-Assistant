const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dietitianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  breakfast: {
    type: String,
    required: [true, 'Please specify breakfast meals'],
    trim: true
  },
  lunch: {
    type: String,
    required: [true, 'Please specify lunch meals'],
    trim: true
  },
  dinner: {
    type: String,
    required: [true, 'Please specify dinner meals'],
    trim: true
  },
  snacks: {
    type: String,
    default: '',
    trim: true
  },
  calories: {
    type: Number,
    required: [true, 'Please specify calorie target'],
    min: [0, 'Calories cannot be negative']
  },
  protein: {
    type: Number,
    default: 0,
    min: [0, 'Protein cannot be negative']
  },
  carbohydrates: {
    type: Number,
    default: 0,
    min: [0, 'Carbohydrates cannot be negative']
  },
  fats: {
    type: Number,
    default: 0,
    min: [0, 'Fats cannot be negative']
  },
  fiber: {
    type: Number,
    default: 0,
    min: [0, 'Fiber cannot be negative']
  },
  waterGoal: {
    type: Number,
    default: 2000, // in ml
    min: [0, 'Water goal cannot be negative']
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MealPlan', MealPlanSchema);
