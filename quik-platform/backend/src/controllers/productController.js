const prisma = require('../config/db');
const inventoryService = require('../services/inventoryService');
const { success, error } = require('../utils/responseHandler');

// Retailer: Add a product
const addProduct = async (req, res) => {
  try {
    const retailer = await prisma.retailer.findUnique({ where: { userId: req.user.id } });
    if (!retailer) return error(res, 'Retailer profile not found. Please set up your shop first.', 404);

    const product = await inventoryService.addProduct(retailer.id, req.body);
    return success(res, product, 'Product added', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

// Retailer: Update a product
const updateProduct = async (req, res) => {
  try {
    const retailer = await prisma.retailer.findUnique({ where: { userId: req.user.id } });
    if (!retailer) return error(res, 'Retailer profile not found', 404);

    const product = await inventoryService.updateProduct(parseInt(req.params.id), retailer.id, req.body);
    return success(res, product, 'Product updated');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

// Retailer: Delete a product
const deleteProduct = async (req, res) => {
  try {
    const retailer = await prisma.retailer.findUnique({ where: { userId: req.user.id } });
    if (!retailer) return error(res, 'Retailer profile not found', 404);

    await inventoryService.deleteProduct(parseInt(req.params.id), retailer.id);
    return success(res, null, 'Product removed');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

// Public: Search products
const searchProducts = async (req, res) => {
  try {
    const { q, category } = req.query;
    const where = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (category) where.category = { equals: category, mode: 'insensitive' };

    const products = await prisma.product.findMany({
      where,
      include: { retailer: { select: { shopName: true, address: true } } },
    });
    return success(res, products);
  } catch (err) {
    return error(res, err.message);
  }
};

// Public: Get all products (for customer home)
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { quantity: { gt: 0 } },
      include: { retailer: { select: { shopName: true, address: true, latitude: true, longitude: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, products);
  } catch (err) {
    return error(res, err.message);
  }
};

// Public: Get products by retailer
const getProductsByRetailer = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { retailerId: parseInt(req.params.retailerId) },
    });
    return success(res, products);
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = { addProduct, updateProduct, deleteProduct, searchProducts, getAllProducts, getProductsByRetailer };
