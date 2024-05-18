import prisma from '../../src/client';
import { beforeAll, beforeEach, afterAll } from '@jest/globals';

const setupTestDB = () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.token.deleteMany();
    await prisma.user.deleteMany();
  });

  beforeEach(async () => {
    await prisma.token.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.token.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    console.log('db disconnected');
  });
};

export default setupTestDB;
