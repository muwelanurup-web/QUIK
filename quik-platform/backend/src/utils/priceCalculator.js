const calculateCartTotal = (cartItems) => {
  return cartItems.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
};

const applyTax = (subtotal, taxRate = 0.08) => {
  return parseFloat((subtotal * taxRate).toFixed(2));
};

const calculateOrderTotal = (subtotal, taxRate = 0.08) => {
  const tax = applyTax(subtotal, taxRate);
  return parseFloat((subtotal + tax).toFixed(2));
};

module.exports = { calculateCartTotal, applyTax, calculateOrderTotal };
