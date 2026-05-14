const prisma = require('../config/db');

const addProduct = async (retailerId, data) => {
  const { name, description, price, quantity, category, imageUrl } = data;
  if (!name || !price) throw new Error('Product name and price are required');
  return prisma.product.create({
    data: { retailerId, name, description, price: parseFloat(price), quantity: parseInt(quantity) || 0, category, imageUrl },
  });
};

const updateProduct = async (productId, retailerId, data) => {
  const existing = await prisma.product.findFirst({ where: { id: productId, retailerId } });
  if (!existing) throw new Error('Product not found or not owned by this retailer');

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = parseFloat(data.price);
  if (data.quantity !== undefined) updateData.quantity = parseInt(data.quantity);
  if (data.category !== undefined) updateData.category = data.category;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

  return prisma.product.update({ where: { id: productId }, data: updateData });
};

const deleteProduct = async (productId, retailerId) => {
  const existing = await prisma.product.findFirst({ where: { id: productId, retailerId } });
  if (!existing) throw new Error('Product not found or not owned by this retailer');
  return prisma.product.delete({ where: { id: productId } });
};

module.exports = { addProduct, updateProduct, deleteProduct };
