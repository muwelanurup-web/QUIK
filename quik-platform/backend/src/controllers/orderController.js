const prisma = require('../config/db');
const orderService = require('../services/orderService');
const { success, error } = require('../utils/responseHandler');

// Customer: Place order
const placeOrder = async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) return error(res, 'Delivery address is required', 400);

    const order = await orderService.createOrderFromCart(req.user.id, address);
    return success(res, order, 'Order placed successfully', 201);
  } catch (err) {
    return error(res, err.message, 400);
  }
};

// Customer: View own orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.user.id },
      include: {
        items: { include: { product: true } },
        retailer: { select: { shopName: true, address: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, orders);
  } catch (err) {
    return error(res, err.message);
  }
};

// Retailer: View incoming orders
const getRetailerOrders = async (req, res) => {
  try {
    const retailer = await prisma.retailer.findUnique({ where: { userId: req.user.id } });
    if (!retailer) return error(res, 'Retailer profile not found', 404);

    const orders = await prisma.order.findMany({
      where: { retailerId: retailer.id },
      include: {
        items: { include: { product: true } },
        customer: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, orders);
  } catch (err) {
    return error(res, err.message);
  }
};

// Retailer: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) return error(res, 'Invalid status', 400);

    const retailer = await prisma.retailer.findUnique({ where: { userId: req.user.id } });
    if (!retailer) return error(res, 'Retailer profile not found', 404);

    const order = await prisma.order.findFirst({
      where: { id: parseInt(req.params.id), retailerId: retailer.id },
    });
    if (!order) return error(res, 'Order not found', 404);

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status },
    });
    return success(res, updated, 'Order status updated');
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = { placeOrder, getMyOrders, getRetailerOrders, updateOrderStatus };
