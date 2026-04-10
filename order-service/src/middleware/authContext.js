// src/middleware/authContext.js
const attachUserContext = (req, res, next) => {
  const userId = req.header("x-user-id");
  if (userId) {
    req.user = {
      id: parseInt(userId, 10),
      email: req.header("x-user-email") || undefined,
      name: req.header("x-user-name") || undefined,
      role: req.header("x-user-role") || undefined,
    };
  }
  next();
};

module.exports = attachUserContext;
