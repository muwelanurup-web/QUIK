import api from './api';

export const getAllProducts = () => api.get('/products');
export const searchProducts = (q, category) => api.get(`/products/search`, { params: { q, category } });
export const getProductsByRetailer = (retailerId) => api.get(`/products/retailer/${retailerId}`);
export const addProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Retailer profile
export const getRetailerProfile = () => api.get('/retailers/profile');
export const saveRetailerProfile = (data) => api.post('/retailers/profile', data);
export const getAllRetailers = () => api.get('/retailers');
