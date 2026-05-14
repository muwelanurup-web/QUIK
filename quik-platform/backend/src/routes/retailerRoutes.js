const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, getMyProfile, getAllRetailers } = require('../controllers/retailerController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', getAllRetailers);
router.get('/profile', authenticate, authorizeRoles('RETAILER'), getMyProfile);
router.post('/profile', authenticate, authorizeRoles('RETAILER'), createOrUpdateProfile);

module.exports = router;
