import { PrismaClient } from '@prisma/client';

// Instanciar el cliente de Prisma para interactuar con PostgreSQL
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export default prisma;
