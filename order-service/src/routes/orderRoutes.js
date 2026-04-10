// src/routes/orderRoutes.js
const router = require("express").Router();
const {
  createOrder,
  getOrdersByCustomer,
  updateOrderStatus,
} = require("../controllers/orderController");
const {
  createOrderValidation,
  getOrdersValidation,
  updateStatusValidation,
} = require("../middleware/validate");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API quản lý đơn hàng
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderDto'
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công
 *       422:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/", createOrderValidation, createOrder);

const requireCustomerFromToken = (handler) => (req, res, next) => {
  if (!req.user?.id) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu customerId trong path hoặc token" });
  }
  req.params.customerId = req.user.id.toString();
  return handler(req, res, next);
};

/**
 * @swagger
 * /api/orders/customers/me:
 *   get:
 *     summary: Lấy đơn hàng của user hiện tại (qua token)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, shipping, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng của user hiện tại
 *
 * /api/orders/customers/{customerId}:
 *   get:
 *     summary: Lấy đơn hàng theo ID khách hàng cụ thể
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID khách hàng
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, shipping, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 */
router.get("/customers/me", getOrdersValidation, requireCustomerFromToken(getOrdersByCustomer));
router.get("/customers/:customerId", getOrdersValidation, getOrdersByCustomer);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipping, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch("/:id/status", updateStatusValidation, updateOrderStatus);

module.exports = router;
