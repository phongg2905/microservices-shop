const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const prismaGlobal = globalThis;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = prismaGlobal.__productPrisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.__productPrisma = prisma;
}

module.exports = prisma;