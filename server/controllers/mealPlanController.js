const MealPlan = require('../models/MealPlan');
const Client = require('../models/Client');
const Notification = require('../models/Notification');

// @desc    Create a meal plan for a client
// @route   POST /api/mealplans
// @access  Private/Dietitian
const createMealPlan = async (req, res, next) => {
  try {
    const {
      clientId,
      breakfast,
      lunch,
      dinner,
      snacks,
      calories,
      protein,
      carbohydrates,
      fats,
      fiber,
      waterGoal,
      notes
    } = req.body;

    // Verify if client is assigned to this dietitian
    const client = await Client.findOne({ userId: clientId, dietitianId: req.user._id });
    if (!client && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'You are not authorized to create a meal plan for this client' });
    }

    const mealPlan = await MealPlan.create({
      clientId,
      dietitianId: req.user._id,
      breakfast,
      lunch,
      dinner,
      snacks,
      calories,
      protein: protein || 0,
      carbohydrates: carbohydrates || 0,
      fats: fats || 0,
      fiber: fiber || 0,
      waterGoal: waterGoal || 2000,
      notes
    });

    // Notify user
    await Notification.create({
      userId: clientId,
      title: 'New Meal Plan Created',
      message: `Dietitian ${req.user.name} has created a new meal plan: Breakfast: ${breakfast.substring(0, 30)}...`
    });

    res.status(201).json({
      success: true,
      message: 'Meal plan created successfully',
      data: mealPlan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get meal plans
// @route   GET /api/mealplans
// @access  Private
const getMealPlans = async (req, res, next) => {
  try {
    let query = {};

    // Filter by role
    if (req.user.role === 'User') {
      query.clientId = req.user._id;
    } else if (req.user.role === 'Dietitian') {
      // If dietitian wants plans for a specific client
      if (req.query.clientId) {
        query.clientId = req.query.clientId;
        query.dietitianId = req.user._id;
      } else {
        query.dietitianId = req.user._id;
      }
    } else if (req.user.role === 'Admin') {
      if (req.query.clientId) {
        query.clientId = req.query.clientId;
      }
    }

    const mealPlans = await MealPlan.find(query)
      .populate('clientId', 'name email')
      .populate('dietitianId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: mealPlans.length,
      data: mealPlans
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a meal plan
// @route   PUT /api/mealplans/:id
// @access  Private/Dietitian
const updateMealPlan = async (req, res, next) => {
  try {
    let mealPlan = await MealPlan.findById(req.params.id);

    if (!mealPlan) {
      return res.status(404).json({ success: false, message: 'Meal plan not found' });
    }

    // Auth check: Must be the dietitian who authored it, or Admin
    if (
      mealPlan.dietitianId.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this meal plan' });
    }

    const updatedPlan = await MealPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Notify user
    await Notification.create({
      userId: mealPlan.clientId,
      title: 'Meal Plan Updated',
      message: `Dietitian ${req.user.name} has updated your meal plan.`
    });

    res.status(200).json({
      success: true,
      message: 'Meal plan updated successfully',
      data: updatedPlan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a meal plan
// @route   DELETE /api/mealplans/:id
// @access  Private/Dietitian
const deleteMealPlan = async (req, res, next) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);

    if (!mealPlan) {
      return res.status(404).json({ success: false, message: 'Meal plan not found' });
    }

    // Auth check: Must be the dietitian who authored it, or Admin
    if (
      mealPlan.dietitianId.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this meal plan' });
    }

    await MealPlan.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Meal plan removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMealPlan,
  getMealPlans,
  updateMealPlan,
  deleteMealPlan
};
