const User = require('../models/User');
const Client = require('../models/Client');
const MealPlan = require('../models/MealPlan');
const Progress = require('../models/Progress');
const Notification = require('../models/Notification');

// @desc    Get Admin Dashboard Stats and Analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'User' });
    const totalDietitians = await User.countDocuments({ role: 'Dietitian' });
    const totalMealPlans = await MealPlan.countDocuments();
    const totalActiveClients = await Client.countDocuments({ status: 'Active' });

    // Fetch user demographics for analytics (e.g. gender counts)
    const genderDemographics = await User.aggregate([
      { $match: { role: 'User', gender: { $ne: '' } } },
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]);

    // Fetch dietary preferences demographics
    const dietDemographics = await User.aggregate([
      { $match: { role: 'User' } },
      { $group: { _id: '$dietaryPreference', count: { $sum: 1 } } }
    ]);

    // Fetch monthly user registration stats for the past 6 months
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);

    // Compile a live system-wide Activity Log
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentMealPlans = await MealPlan.find().populate('clientId', 'name').populate('dietitianId', 'name').sort({ createdAt: -1 }).limit(5);
    const recentProgress = await Progress.find().populate('clientId', 'name').sort({ createdAt: -1 }).limit(5);

    const activityLogs = [];

    recentUsers.forEach(u => {
      activityLogs.push({
        type: 'Registration',
        message: `New ${u.role} registered: ${u.name} (${u.email})`,
        time: u.createdAt
      });
    });

    recentMealPlans.forEach(p => {
      activityLogs.push({
        type: 'Meal Plan',
        message: `Dietitian ${p.dietitianId?.name || 'Unknown'} created a plan for Client ${p.clientId?.name || 'Unknown'}`,
        time: p.createdAt
      });
    });

    recentProgress.forEach(pr => {
      activityLogs.push({
        type: 'Progress Update',
        message: `Client ${pr.clientId?.name || 'Unknown'} logged progress for ${pr.date}`,
        time: pr.createdAt
      });
    });

    // Sort activity logs chronologically (newest first)
    activityLogs.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalDietitians,
          totalMealPlans,
          totalActiveClients
        },
        analytics: {
          genderDemographics,
          dietDemographics,
          userGrowth
        },
        activityLogs: activityLogs.slice(0, 10)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details or role (Admin only)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { role } = req.body;
    if (!role || !['User', 'Dietitian', 'Admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    // If changing role from User to Dietitian or vice versa, handle Client document
    if (oldRole === 'User' && role !== 'User') {
      await Client.deleteOne({ userId: user._id });
    } else if (oldRole !== 'User' && role === 'User') {
      // If downgraded to a user, create a Client document
      await Client.create({
        userId: user._id,
        status: 'Pending'
      });
    }

    res.status(200).json({
      success: true,
      message: `User role updated successfully to ${role}`,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  updateUserRole
};
