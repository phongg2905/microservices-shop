const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] AUTH ERROR`, err);
  if (err.statusCode) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  if (err.name === "ValidationError") {
    return res.status(422).json({
      success: false,
      message: err.message,
    });
  }
  return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
};

module.exports = errorHandler;
