const User = require('../models/User');
const Client = require('../models/Client');
const MealPlan = require('../models/MealPlan');
const Progress = require('../models/Progress');
const Notification = require('../models/Notification');

// @desc    Get all users (Admin only) or clients (Dietitian / Admin)
// @route   GET /api/users
// @access  Private/Admin or Dietitian
const getUsers = async (req, res, next) => {
  try {
    let query = {};
    
    // If request is made by a Dietitian, restrict users or return clients.
    // For general admins, return all.
    if (req.user.role === 'Dietitian') {
      // Find clients assigned to this dietitian
      const clients = await Client.find({ dietitianId: req.user._id }).populate('userId');
      const users = clients.map(c => c.userId).filter(u => u !== null);
      return res.status(200).json({ success: true, count: users.length, data: users });
    }

    const users = await User.find(query);
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Authorization: User can view themselves, Admin can view anyone, Dietitian can view their assigned clients
    if (
      req.user.role === 'User' && 
      req.user._id.toString() !== user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this profile' });
    }

    if (req.user.role === 'Dietitian') {
      const clientRelation = await Client.findOne({ userId: user._id, dietitianId: req.user._id });
      if (!clientRelation && req.user._id.toString() !== user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this client profile' });
      }
    }

    // Retrieve client metrics if user role is 'User'
    let clientMetrics = null;
    if (user.role === 'User') {
      clientMetrics = await Client.findOne({ userId: user._id }).populate('dietitianId', 'name email');
    }

    res.status(200).json({
      success: true,
      data: user,
      clientMetrics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Auth check: self or admin
    if (
      req.user.role !== 'Admin' && 
      req.user._id.toString() !== user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this profile' });
    }

    const {
      name,
      phone,
      gender,
      age,
      height,
      weight,
      calorieGoal,
      dietaryPreference,
      profileImage
    } = req.body;

    // Fields allowed to update
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (gender !== undefined) user.gender = gender;
    if (age !== undefined) user.age = age;
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (calorieGoal !== undefined) user.calorieGoal = calorieGoal;
    if (dietaryPreference !== undefined) user.dietaryPreference = dietaryPreference;
    if (profileImage !== undefined) user.profileImage = profileImage;

    // Auto-calculate BMI if both height and weight are present
    if (user.height && user.weight) {
      const heightInMeters = user.height / 100;
      user.bmi = parseFloat((user.weight / (heightInMeters * heightInMeters)).toFixed(1));
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user profile (Cascades data)
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Auth check: self or admin
    if (
      req.user.role !== 'Admin' && 
      req.user._id.toString() !== user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this account' });
    }

    // Cascade deletions if user role is 'User'
    if (user.role === 'User') {
      await Client.deleteOne({ userId: user._id });
      await MealPlan.deleteMany({ clientId: user._id });
      await Progress.deleteMany({ clientId: user._id });
      await Notification.deleteMany({ userId: user._id });
    } else if (user.role === 'Dietitian') {
      // Free the dietitian's clients
      await Client.updateMany(
        { dietitianId: user._id },
        { $set: { dietitianId: null, status: 'Pending' } }
      );
      await MealPlan.deleteMany({ dietitianId: user._id });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Account deleted and all associated data cleared'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser
};
