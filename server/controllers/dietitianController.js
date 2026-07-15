const Client = require('../models/Client');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all clients assigned to the logged-in dietitian
// @route   GET /api/dietitian/clients
// @access  Private/Dietitian
const getAssignedClients = async (req, res, next) => {
  try {
    const clients = await Client.find({ dietitianId: req.user._id }).populate('userId');
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all clients without a dietitian (unassigned)
// @route   GET /api/dietitian/unassigned
// @access  Private/Dietitian
const getUnassignedClients = async (req, res, next) => {
  try {
    const unassigned = await Client.find({ dietitianId: null }).populate('userId');
    res.status(200).json({
      success: true,
      count: unassigned.length,
      data: unassigned
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign a client to the logged-in dietitian
// @route   PUT /api/dietitian/assign/:clientId
// @access  Private/Dietitian
const assignClientToMe = async (req, res, next) => {
  try {
    let client = await Client.findOne({ userId: req.params.clientId });

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client profile not found' });
    }

    if (client.dietitianId) {
      return res.status(400).json({ success: false, message: 'Client already assigned to another dietitian' });
    }

    client.dietitianId = req.user._id;
    client.status = 'Active';
    await client.save();

    // Create notification for user
    await Notification.create({
      userId: client.userId,
      title: 'Dietitian Assigned',
      message: `Dietitian ${req.user.name} has accepted you as a client. They will construct a customized meal plan for you.`
    });

    res.status(200).json({
      success: true,
      message: 'Client successfully assigned to you',
      data: client
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update client health details and goals
// @route   PUT /api/dietitian/clients/:clientId
// @access  Private/Dietitian
const updateClientMetrics = async (req, res, next) => {
  try {
    let client = await Client.findOne({ userId: req.params.clientId });

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client details not found' });
    }

    // Verify it is assigned to this dietitian
    if (client.dietitianId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not the assigned dietitian for this client' });
    }

    const { healthConditions, allergies, goals, status } = req.body;

    if (healthConditions !== undefined) client.healthConditions = healthConditions;
    if (allergies !== undefined) client.allergies = allergies;
    if (goals !== undefined) client.goals = goals;
    if (status !== undefined) client.status = status;

    await client.save();

    // Notify client
    await Notification.create({
      userId: client.userId,
      title: 'Profile Updated by Dietitian',
      message: `Dietitian ${req.user.name} updated your health goals or conditions info.`
    });

    res.status(200).json({
      success: true,
      message: 'Client metrics updated successfully',
      data: client
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssignedClients,
  getUnassignedClients,
  assignClientToMe,
  updateClientMetrics
};
