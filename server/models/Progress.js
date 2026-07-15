const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // Stored as 'YYYY-MM-DD' for simple indexing and single daily logs
    required: true
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  caloriesConsumed: {
    type: Number,
    default: 0,
    min: [0, 'Calories cannot be negative']
  },
  proteinConsumed: {
    type: Number,
    default: 0,
    min: [0, 'Protein cannot be negative']
  },
  carbsConsumed: {
    type: Number,
    default: 0,
    min: [0, 'Carbohydrates cannot be negative']
  },
  fatsConsumed: {
    type: Number,
    default: 0,
    min: [0, 'Fats cannot be negative']
  },
  waterConsumed: {
    type: Number,
    default: 0, // in ml
    min: [0, 'Water consumed cannot be negative']
  },
  exercise: {
    type: Number, // duration in minutes
    default: 0,
    min: [0, 'Exercise minutes cannot be negative']
  },
  adherencePercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one progress entry per client per day
ProgressSchema.index({ clientId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);
