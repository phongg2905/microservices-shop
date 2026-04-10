// src/swagger/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Order Service API",
      version: "1.0.0",
      description: "API quản lý đơn hàng cho Lab 2",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        OrderItem: {
          type: "object",
          properties: {
            productId: { type: "integer", example: 1 },
            productName: { type: "string", example: "iPhone 15 Pro" },
            price: { type: "number", example: 27990000 },
            quantity: { type: "integer", example: 2 },
            subtotal: { type: "number", example: 55980000 },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "string" },
            orderCode: { type: "string", example: "ORD-20260101-0001" },
            customerId: { type: "integer" },
            customerName: { type: "string" },
            customerEmail: { type: "string" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
            totalAmount: { type: "number" },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        CreateOrderDto: {
          type: "object",
          required: ["items"],
          properties: {
            customerId: { type: "integer" },
            customerName: { type: "string" },
            customerEmail: { type: "string" },
            items: {
              type: "array",
              items: {
                type: "object",
                required: ["productId", "quantity"],
                properties: {
                  productId: { type: "integer" },
                  quantity: { type: "integer" },
                },
              },
            },
            shippingAddress: {
              type: "object",
              properties: {
                street: { type: "string" },
                city: { type: "string" },
                district: { type: "string" },
              },
            },
            note: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
