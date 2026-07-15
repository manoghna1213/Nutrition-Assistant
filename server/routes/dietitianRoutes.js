const express = require('express');
const router = express.Router();
const {
  getAssignedClients,
  getUnassignedClients,
  assignClientToMe,
  updateClientMetrics
} = require('../controllers/dietitianController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Dietitian'));

router.get('/clients', getAssignedClients);
router.get('/unassigned', getUnassignedClients);
router.put('/assign/:clientId', assignClientToMe);
router.put('/clients/:clientId', updateClientMetrics);

module.exports = router;
