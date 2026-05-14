/**
 * Mock payment service — simulates payment processing.
 * In production, replace with Stripe/Razorpay/etc.
 */
const processPayment = async (amount) => {
  // Simulate a small delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  // Always succeeds in mock mode
  return { success: true, transactionId: `TXN_${Date.now()}`, amount };
};

module.exports = { processPayment };
