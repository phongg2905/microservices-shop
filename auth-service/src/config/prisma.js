const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const prismaGlobal = globalThis;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = prismaGlobal.__authPrisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.__authPrisma = prisma;
}

module.exports = prisma;