// src/controllers/orderController.js
const Order = require("../models/Order");

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "";

const BadRequest = (message, details) => {
  const error = new Error(message);
  error.statusCode = 400;
  if (details) error.details = details;
  return error;
};

const resolveCustomerContext = (req, fallback = {}) => {
  const id = req.user?.id ?? fallback.customerId ?? req.params?.customerId;
  return {
    id: id ? parseInt(id, 10) : undefined,
    name: req.user?.name ?? fallback.customerName,
    email: req.user?.email ?? fallback.customerEmail,
  };
};

const fetchProductSnapshot = async (productId) => {
  if (!PRODUCT_SERVICE_URL) {
    return null;
  }
  try {
    const response = await fetch(`${PRODUCT_SERVICE_URL}/api/products/${productId}`);
    if (!response.ok) {
      return null;
    }
    const payload = await response.json();
    return payload?.data;
  } catch (error) {
    console.error("Cannot reach Product Service", error);
    return null;
  }
};

// Tạo đơn hàng mới
const createOrder = async (req, res, next) => {
  try {
    const customer = resolveCustomerContext(req, req.body);
    if (!customer.id) {
      throw BadRequest("Thiếu thông tin khách hàng");
    }

    const items = req.body.items || [];
    if (!items.length) {
      throw BadRequest("Đơn hàng phải có ít nhất 1 sản phẩm");
    }

    const processedItems = await Promise.all(
      items.map(async (item) => {
        const quantity = parseInt(item.quantity, 10);
        if (!quantity || quantity <= 0) {
          throw BadRequest("Số lượng sản phẩm phải lớn hơn 0");
        }

        const product = await fetchProductSnapshot(item.productId);
        if (!product) {
          throw BadRequest(`Không tìm thấy sản phẩm #${item.productId}`);
        }

        const price = Number(product.price);
        return {
          productId: product.id,
          productName: product.name,
          price,
          quantity,
          subtotal: price * quantity,
        };
      })
    );

    const totalAmount = processedItems.reduce((sum, current) => sum + current.subtotal, 0);

    const order = await Order.create({
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      items: processedItems,
      totalAmount,
      shippingAddress: req.body.shippingAddress,
      note: req.body.note,
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// Lấy đơn hàng theo khách hàng, có phân trang
const getOrdersByCustomer = async (req, res, next) => {
  try {
    const customer = resolveCustomerContext(req, { customerId: req.params.customerId });
    if (!customer.id) {
      throw BadRequest("Thiếu customerId");
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { customerId: customer.id };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrdersByCustomer, updateOrderStatus };
