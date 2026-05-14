const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getRetailerOrders, updateOrderStatus } = require('../controllers/orderController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Customer routes
router.post('/', authenticate, authorizeRoles('CUSTOMER'), placeOrder);
router.get('/my', authenticate, authorizeRoles('CUSTOMER'), getMyOrders);

// Retailer routes
router.get('/retailer', authenticate, authorizeRoles('RETAILER'), getRetailerOrders);
router.put('/:id/status', authenticate, authorizeRoles('RETAILER'), updateOrderStatus);

module.exports = router;
