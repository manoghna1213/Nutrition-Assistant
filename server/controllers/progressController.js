const Progress = require('../models/Progress');
const MealPlan = require('../models/MealPlan');
const User = require('../models/User');

// @desc    Log daily progress (Upsert - Updates if client already logged this date)
// @route   POST /api/progress
// @access  Private/User
const logProgress = async (req, res, next) => {
  try {
    const {
      date,
      weight,
      caloriesConsumed,
      proteinConsumed,
      carbsConsumed,
      fatsConsumed,
      waterConsumed,
      exercise
    } = req.body;

    const clientId = req.user._id;

    // Get client target metrics (from User or their current MealPlan)
    let calorieGoal = req.user.calorieGoal || 2000;
    const currentPlan = await MealPlan.findOne({ clientId }).sort({ createdAt: -1 });
    if (currentPlan && currentPlan.calories) {
      calorieGoal = currentPlan.calories;
    }

    // Calculate adherence percentage
    // Closer to calorie goal = higher adherence
    let adherence = 100;
    if (caloriesConsumed && calorieGoal) {
      const diff = Math.abs(caloriesConsumed - calorieGoal);
      const deviation = (diff / calorieGoal) * 100;
      adherence = Math.max(0, Math.round(100 - deviation));
    }

    // Find and update or create new progress record
    const filter = { clientId, date };
    const update = {
      weight: weight !== undefined ? weight : req.user.weight,
      caloriesConsumed: caloriesConsumed || 0,
      proteinConsumed: proteinConsumed || 0,
      carbsConsumed: carbsConsumed || 0,
      fatsConsumed: fatsConsumed || 0,
      waterConsumed: waterConsumed || 0,
      exercise: exercise || 0,
      adherencePercentage: adherence
    };

    // If weight was updated, update it in User record too
    if (weight) {
      await User.findByIdAndUpdate(clientId, { weight });
    }

    const progress = await Progress.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Daily progress logged successfully',
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get progress logs
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'User') {
      query.clientId = req.user._id;
    } else {
      // Admins and Dietitians must supply a clientId query parameter
      if (!req.query.clientId) {
        return res.status(400).json({ success: false, message: 'Please specify a clientId parameter' });
      }
      query.clientId = req.query.clientId;
    }

    // Optional date range
    if (req.query.startDate && req.query.endDate) {
      query.date = {
        $gte: req.query.startDate,
        $lte: req.query.endDate
      };
    }

    const logs = await Progress.find(query).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update progress log
// @route   PUT /api/progress/:id
// @access  Private
const updateProgress = async (req, res, next) => {
  try {
    let progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress record not found' });
    }

    // Auth check: Must be owner or admin
    if (
      progress.clientId.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this progress record' });
    }

    const updatedProgress = await Progress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Progress record updated successfully',
      data: updatedProgress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete progress log
// @route   DELETE /api/progress/:id
// @access  Private
const deleteProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress record not found' });
    }

    // Auth check: Must be owner or admin
    if (
      progress.clientId.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this progress record' });
    }

    await Progress.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Progress record deleted'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  logProgress,
  getProgress,
  updateProgress,
  deleteProgress
};
