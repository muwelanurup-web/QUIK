const prisma = require('../config/db');
const { success, error } = require('../utils/responseHandler');

const getCart = async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: { include: { retailer: { select: { shopName: true } } } } },
    });
    return success(res, cartItems);
  } catch (err) {
    return error(res, err.message);
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return error(res, 'productId is required', 400);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return error(res, 'Product not found', 404);
    if (product.quantity < quantity) return error(res, 'Insufficient stock', 400);

    const cartItem = await prisma.cartItem.upsert({
      where: { userId_productId: { userId: req.user.id, productId } },
      update: { quantity: { increment: quantity } },
      create: { userId: req.user.id, productId, quantity },
      include: { product: true },
    });

    return success(res, cartItem, 'Added to cart', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return error(res, 'Valid quantity required', 400);

    const item = await prisma.cartItem.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });
    if (!item) return error(res, 'Cart item not found', 404);

    const updated = await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
      include: { product: true },
    });

    return success(res, updated, 'Cart updated');
  } catch (err) {
    return error(res, err.message);
  }
};

const removeFromCart = async (req, res) => {
  try {
    const item = await prisma.cartItem.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });
    if (!item) return error(res, 'Cart item not found', 404);

    await prisma.cartItem.delete({ where: { id: item.id } });
    return success(res, null, 'Item removed from cart');
  } catch (err) {
    return error(res, err.message);
  }
};

const clearCart = async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    return success(res, null, 'Cart cleared');
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
