const prisma = require('../config/db');
const { calculateCartTotal, calculateOrderTotal } = require('../utils/priceCalculator');
const paymentService = require('./paymentService');

const createOrderFromCart = async (userId, address) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) throw new Error('Cart is empty');

  // Group by retailer
  const retailerMap = {};
  for (const item of cartItems) {
    const rid = item.product.retailerId;
    if (!retailerMap[rid]) retailerMap[rid] = [];
    retailerMap[rid].push(item);
  }

  const orders = [];

  for (const [retailerId, items] of Object.entries(retailerMap)) {
    const subtotal = calculateCartTotal(items);
    const total = calculateOrderTotal(subtotal);

    // Mock payment (called before transaction — in real app, use idempotency keys)
    await paymentService.processPayment(total);

    // Atomic transaction: stock check + order create + stock deduct + cart clear
    const order = await prisma.$transaction(async (tx) => {
      // Re-validate stock inside the transaction to prevent race conditions
      for (const item of items) {
        const freshProduct = await tx.product.findUnique({ where: { id: item.productId } });
        if (!freshProduct || freshProduct.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product: ${item.product.name}`);
        }
      }

      // Create order with all items
      const newOrder = await tx.order.create({
        data: {
          customerId: userId,
          retailerId: parseInt(retailerId),
          totalAmount: total,
          address,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      });

      // Deduct stock atomically
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    orders.push(order);
  }

  // Clear cart after all orders placed successfully
  await prisma.cartItem.deleteMany({ where: { userId } });

  return orders;
};

module.exports = { createOrderFromCart };
