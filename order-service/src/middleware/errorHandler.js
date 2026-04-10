// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error("ORDER ERROR", err);

  if (err.name === "ValidationError") {
    return res.status(422).json({
      success: false,
      message: err.message,
      errors: Object.values(err.errors || {}).map((item) => ({
        field: item.path,
        message: item.message,
      })),
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { errors: err.details }),
    });
  }

  return res.status(500).json({
    success: false,
    message: "Lỗi hệ thống",
  });
};

module.exports = errorHandler;
