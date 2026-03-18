const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({ where: { id: 1 } });
  if (!existing) {
    await prisma.user.create({
      data: {
        id: 1,
        email: 'admin@fitphung.com',
        password: 'test',
        name: 'Admin',
      },
    });
    console.log('Seed user created');
  } else {
    console.log('User already exists');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());