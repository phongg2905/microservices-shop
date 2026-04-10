const { body, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: errors.array().map((err) => ({ field: err.path, message: err.msg })),
    });
  }
  return next();
};

const registerValidator = [
  body("name").isLength({ min: 2 }).withMessage("Tên phải >= 2 ký tự"),
  body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Mật khẩu >= 6 ký tự"),
  handleValidation,
];

const loginValidator = [
  body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),
  body("password").notEmpty().withMessage("Vui lòng nhập mật khẩu"),
  handleValidation,
];

module.exports = { registerValidator, loginValidator };
