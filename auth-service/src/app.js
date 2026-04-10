const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/health", (req, res) =>
  res.json({ status: "ok", service: process.env.SERVICE_NAME || "auth-service" })
);

app.use("/api/auth", authRoutes);
app.use(errorHandler);

module.exports = app;
