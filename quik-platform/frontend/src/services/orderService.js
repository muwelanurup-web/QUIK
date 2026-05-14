import api from './api';

export const getCart = () => api.get('/cart');
export const addToCart = (productId, quantity = 1) => api.post('/cart', { productId, quantity });
export const updateCartItem = (id, quantity) => api.put(`/cart/${id}`, { quantity });
export const removeFromCart = (id) => api.delete(`/cart/${id}`);
export const clearCart = () => api.delete('/cart/clear');

export const placeOrder = (address) => api.post('/orders', { address });
export const getMyOrders = () => api.get('/orders/my');
export const getRetailerOrders = () => api.get('/orders/retailer');
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
