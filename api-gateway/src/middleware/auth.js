// src/middleware/auth.js
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

const injectUserHeaders = (proxyReq, req) => {
  if (req.user) {
    proxyReq.setHeader("x-user-id", req.user.id);
    if (req.user.email) proxyReq.setHeader("x-user-email", req.user.email);
    if (req.user.name) proxyReq.setHeader("x-user-name", req.user.name);
    if (req.user.role) proxyReq.setHeader("x-user-role", req.user.role);
  }
};

module.exports = { authenticate, injectUserHeaders };
