import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  const hashedPassword = await bcrypt.hash('admin@123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      isEmailVerified: true
    }
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
