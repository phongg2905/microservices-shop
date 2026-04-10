// src/middleware/validate.js
const { body, validationResult, param, query } = require("express-validator");

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

const createOrderValidation = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Cần ít nhất 1 sản phẩm trong đơn"),
  body("items.*.productId").isInt({ min: 1 }).withMessage("productId không hợp lệ"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Số lượng mỗi sản phẩm phải >= 1"),
  body("shippingAddress").optional().isObject().withMessage("Địa chỉ phải là object"),
  body("shippingAddress.street").optional().isString(),
  body("shippingAddress.city").optional().isString(),
  body("shippingAddress.district").optional().isString(),
  body("note").optional().isString().isLength({ max: 500 }),
  handleValidation,
];

const getOrdersValidation = [
  param("customerId").optional().isInt({ min: 1 }).withMessage("customerId không hợp lệ"),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("status")
    .optional()
    .isIn(["pending", "confirmed", "shipping", "delivered", "cancelled"]),
  handleValidation,
];

const updateStatusValidation = [
  param("id").isMongoId().withMessage("ID đơn hàng không hợp lệ"),
  body("status")
    .isIn(["pending", "confirmed", "shipping", "delivered", "cancelled"])
    .withMessage("Trạng thái không hợp lệ"),
  handleValidation,
];

module.exports = {
  handleValidation,
  createOrderValidation,
  getOrdersValidation,
  updateStatusValidation,
};
