require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 3002;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Order Service listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start Order Service", error);
    process.exit(1);
  }
};

start();

process.on("SIGINT", () => {
  process.exit(0);
});

process.on("SIGTERM", () => {
  process.exit(0);
});
