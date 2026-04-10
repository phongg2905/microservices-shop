const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} = require("../utils/token");

const buildPayload = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
});

const sendAuthResponse = (res, user, status = 200) => {
  const payload = buildPayload(user);
  return res.status(status).json({
    success: true,
    data: {
      user: payload,
      accessToken: createAccessToken(payload),
      refreshToken: createRefreshToken({ id: user.id }),
    },
  });
};

const register = async (req, res, next) => {
  try {
    const existing = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (existing) {
      const error = new Error("Email đã tồn tại");
      error.statusCode = 409;
      throw error;
    }

    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashed,
        role: req.body.role || "customer",
      },
    });

    return sendAuthResponse(res, user, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (!user) {
      const error = new Error("Sai email hoặc mật khẩu");
      error.statusCode = 401;
      throw error;
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      const error = new Error("Sai email hoặc mật khẩu");
      error.statusCode = 401;
      throw error;
    }

    return sendAuthResponse(res, user);
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      const error = new Error("Thiếu refreshToken");
      error.statusCode = 400;
      throw error;
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      const error = new Error("Refresh token không hợp lệ");
      error.statusCode = 401;
      throw error;
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      const error = new Error("Token không hợp lệ");
      error.statusCode = 401;
      throw error;
    }
    return sendAuthResponse(res, user);
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      const error = new Error("User không tồn tại");
      error.statusCode = 404;
      throw error;
    }
    res.json({ success: true, data: buildPayload(user) });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refresh, me };
