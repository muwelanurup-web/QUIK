const { PrismaClient } = require('@prisma/client');

// Global singleton prevents connection pool exhaustion during nodemon hot reloads.
// In production the server starts once, so this doesn't matter there.
const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
