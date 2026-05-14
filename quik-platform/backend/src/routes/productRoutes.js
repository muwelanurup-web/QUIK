const express = require('express');
const router = express.Router();
const {
  addProduct, updateProduct, deleteProduct,
  searchProducts, getAllProducts, getProductsByRetailer
} = require('../controllers/productController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/retailer/:retailerId', getProductsByRetailer);

// Retailer only
router.post('/', authenticate, authorizeRoles('RETAILER'), addProduct);
router.put('/:id', authenticate, authorizeRoles('RETAILER'), updateProduct);
router.delete('/:id', authenticate, authorizeRoles('RETAILER'), deleteProduct);

module.exports = router;
