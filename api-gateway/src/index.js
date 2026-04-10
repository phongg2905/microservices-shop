const express = require("express");
const { createProxyMiddleware, fixRequestBody } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const { authenticate, injectUserHeaders } = require("./middleware/auth");

const app = express();

const allowedOriginsList = process.env.ALLOWED_ORIGINS
  ?.split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const corsOrigin = allowedOriginsList?.length ? allowedOriginsList : "*";
const corsCredentials = Array.isArray(corsOrigin);

app.use(helmet());
app.use(cors({ origin: corsOrigin, credentials: corsCredentials }));
app.use(express.json());
app.use(morgan("combined"));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

const buildProxy = (target, options = {}) => {
  if (!target) throw new Error("Missing proxy target");

  return createProxyMiddleware({
    target,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req) => {
        fixRequestBody(proxyReq, req);
        if (options.injectHeaders) {
          options.injectHeaders(proxyReq, req);
        }
      },
      error: (err, req, res) => {
        console.error(`Gateway proxy error for ${target}`, err);
        if (!res.headersSent) {
          res.status(503).json({
            message: `${options.label || "Service"} không khả dụng`,
          });
        }
      },
    },
  });
};

app.get("/health", (req, res) => res.json({ status: "ok", gateway: true }));

app.use(
  "/api/products",
  buildProxy(process.env.PRODUCT_SERVICE_URL, { label: "Product Service" })
);

app.use(
  "/api/orders",
  authenticate,
  buildProxy(process.env.ORDER_SERVICE_URL, {
    label: "Order Service",
    injectHeaders: injectUserHeaders,
  })
);

app.use(
  "/api/auth",
  buildProxy(process.env.AUTH_SERVICE_URL, { label: "Auth Service" })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));