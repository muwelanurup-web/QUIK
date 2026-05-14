const prisma = require('../config/db');
const { success, error } = require('../utils/responseHandler');

const createOrUpdateProfile = async (req, res) => {
  try {
    const { shopName, address, latitude, longitude } = req.body;
    if (!shopName || !address) return error(res, 'shopName and address are required', 400);

    const lat = latitude !== undefined && latitude !== '' ? parseFloat(latitude) : null;
    const lng = longitude !== undefined && longitude !== '' ? parseFloat(longitude) : null;

    const retailer = await prisma.retailer.upsert({
      where: { userId: req.user.id },
      update: { shopName, address, latitude: lat, longitude: lng },
      create: { userId: req.user.id, shopName, address, latitude: lat, longitude: lng },
    });

    return success(res, retailer, 'Profile saved');
  } catch (err) {
    return error(res, err.message);
  }
};

const getMyProfile = async (req, res) => {
  try {
    const retailer = await prisma.retailer.findUnique({
      where: { userId: req.user.id },
      include: { products: true },
    });
    if (!retailer) return error(res, 'Retailer profile not found', 404);
    return success(res, retailer);
  } catch (err) {
    return error(res, err.message);
  }
};

const getAllRetailers = async (req, res) => {
  try {
    const retailers = await prisma.retailer.findMany({
      include: { user: { select: { name: true, email: true } } },
    });
    return success(res, retailers);
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = { createOrUpdateProfile, getMyProfile, getAllRetailers };
