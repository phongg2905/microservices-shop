// ───────────────────────────────────────
// src/middleware/errorHandler.js
// ───────────────────────────────────────
const multer = require("multer");

const errorHandler = (err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ERROR:`, err);

    // Lỗi Multer
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    // Lỗi tự custom khi validate file upload
    if (err.message === "Chỉ cho phép upload file ảnh") {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    // Prisma unique constraint violation
    if (err.code === "P2002") {
        return res.status(409).json({
            success: false,
            message: `${err.meta?.target} đã tồn tại`,
        });
    }

    // Prisma record not found
    if (err.code === "P2025") {
        return res.status(404).json({
            success: false,
            message: "Không tìm thấy bản ghi",
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Lỗi hệ thống",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

module.exports = errorHandler;