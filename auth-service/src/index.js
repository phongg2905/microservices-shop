require("dotenv").config();
const app = require("./app");
const prisma = require("./config/prisma");

const PORT = process.env.PORT || 3003;

const start = async () => {
  try {
    await prisma.$connect();
    app.listen(PORT, () => console.log(`Auth Service running on ${PORT}`));
  } catch (error) {
    console.error("Failed to start Auth Service", error);
    process.exit(1);
  }
};

start();

const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
