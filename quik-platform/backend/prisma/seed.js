const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean up existing seed data by email (idempotent)
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.retailer.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedRetailerPass = await bcrypt.hash('123456', 10);
  const hashedCustomerPass = await bcrypt.hash('customer123', 10);

  // Create retailer user
  const retailerUser = await prisma.user.create({
    data: {
      name: 'retailer',
      email: 'retailer@gmail.com',
      password: hashedRetailerPass,
      role: 'RETAILER',
      retailer: {
        create: {
          shopName: 'QuikMart — Indore Central',
          address: 'MG Road, Indore, MP 452001',
          latitude: 22.7196,
          longitude: 75.8577,
        },
      },
    },
    include: { retailer: true },
  });

  // Create customer user
  await prisma.user.create({
    data: {
      name: 'customer',
      email: 'customer@gmail.com',
      password: hashedCustomerPass,
      role: 'CUSTOMER',
    },
  });

  const retailerId = retailerUser.retailer.id;

  // Seed 16 products across categories
  const products = [
    // Groceries
    { name: 'Basmati Rice (5kg)', description: 'Premium aged basmati rice, long grain', price: 349, quantity: 85, category: 'Groceries', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80' },
    { name: 'Atta Whole Wheat (10kg)', description: 'Stone-ground whole wheat flour, no additives', price: 289, quantity: 60, category: 'Groceries', imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80' },
    { name: 'Toor Dal (1kg)', description: 'Split pigeon peas, pure and clean', price: 129, quantity: 120, category: 'Groceries', imageUrl: 'https://images.unsplash.com/photo-1565619624098-aabcb47fbf26?w=400&q=80' },
    { name: 'Sunflower Oil (1L)', description: 'Refined sunflower cooking oil', price: 149, quantity: 50, category: 'Groceries', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80' },

    // Fresh Produce
    { name: 'Fresh Tomatoes (1kg)', description: 'Farm-fresh tomatoes, rich and juicy', price: 39, quantity: 200, category: 'Vegetables', imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaad337?w=400&q=80' },
    { name: 'Spinach Bunch', description: 'Tender baby spinach leaves, freshly harvested', price: 29, quantity: 150, category: 'Vegetables', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80' },
    { name: 'Onions (2kg)', description: 'Fresh red onions, pungent and flavourful', price: 55, quantity: 300, category: 'Vegetables', imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&q=80' },
    { name: 'Alphonso Mangoes (6 pcs)', description: 'Sweet Alphonso mangoes from Ratnagiri', price: 199, quantity: 40, category: 'Fruits', imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80' },

    // Dairy
    { name: 'Amul Toned Milk (1L)', description: 'Fresh toned milk, 3% fat', price: 58, quantity: 90, category: 'Dairy', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80' },
    { name: 'Paneer (200g)', description: 'Soft fresh cottage cheese, homemade style', price: 89, quantity: 45, category: 'Dairy', imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80' },
    { name: 'Curd / Dahi (500g)', description: 'Thick set curd, probiotic rich', price: 45, quantity: 70, category: 'Dairy', imageUrl: 'https://images.unsplash.com/photo-1571212515416-fca988083c52?w=400&q=80' },

    // Snacks
    { name: 'Lay\'s Classic Salted (73g)', description: 'Crispy potato chips, classic salted', price: 30, quantity: 200, category: 'Snacks', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
    { name: 'Haldiram Bhujia (400g)', description: 'Spicy bikaneri bhujia, crispy namkeen', price: 110, quantity: 80, category: 'Snacks', imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&q=80' },

    // Beverages
    { name: 'Real Juice Mixed Fruit (1L)', description: 'No added preservatives, 100% fruit juice blend', price: 99, quantity: 60, category: 'Beverages', imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80' },
    { name: 'Bisleri Water (1L)', description: 'Pure packaged drinking water', price: 20, quantity: 500, category: 'Beverages', imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80' },

    // Household
    { name: 'Vim Dishwash Bar (200g)', description: 'Powerful grease-cutting dish cleaner', price: 22, quantity: 150, category: 'Household', imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80' },
  ];

  for (const product of products) {
    await prisma.product.create({ data: { ...product, retailerId } });
  }

  console.log(`✅ Seeded:`);
  console.log(`   👤 Retailer: retailer@gmail.com / 123456`);
  console.log(`   👤 Customer: customer@gmail.com / customer123`);
  console.log(`   🏪 Shop: QuikMart — Indore Central`);
  console.log(`   📦 ${products.length} products across ${[...new Set(products.map(p => p.category))].length} categories`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
