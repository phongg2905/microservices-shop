// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");
const orderRoutes = require("./routes/orderRoutes");
const errorHandler = require("./middleware/errorHandler");
const attachUserContext = require("./middleware/authContext");

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(attachUserContext);

app.get("/health", (req, res) =>
  res.json({ status: "ok", service: process.env.SERVICE_NAME || "order-service" })
);

app.use("/api/orders", orderRoutes);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: "Order Service API Docs",
  })
);
app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));

app.use(errorHandler);

module.exports = app;
