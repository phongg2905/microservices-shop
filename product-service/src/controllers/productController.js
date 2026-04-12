// src/controllers/productController.js
const prisma = require("../config/prisma");

const {
    redis,
    buildProductsCacheKey,
    clearProductsCache,
} = require("../utils/cache");

// ──────────────────────────────────
// GET /api/products — Lấy danh sách có phân trang, lọc, sắp xếp
// ──────────────────────────────────
const getProducts = async (req, res, next) => {
    try {
        const cacheKey = buildProductsCacheKey(req.query);

        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            console.log("Products served from Redis cache");
            return res.json(JSON.parse(cachedData));
        }

        const {
            page = 1,
            limit = 10,
            search = "",
            category,
            sortBy = "createdAt",
            order = "desc",
            minPrice,
            maxPrice,
            inStock,
        } = req.query;

        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);
        const skip = (parsedPage - 1) * parsedLimit;

        const where = {
            isActive: true,
            ...(search && {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            }),
            ...(category && {
                category: {
                    slug: category,
                },
            }),
            ...((minPrice || maxPrice) && {
                price: {
                    ...(minPrice && { gte: parseFloat(minPrice) }),
                    ...(maxPrice && { lte: parseFloat(maxPrice) }),
                },
            }),
            ...(inStock === "true" && {
                stock: {
                    gt: 0,
                },
            }),
        };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: {
                        select: {
                            name: true,
                            slug: true,
                        },
                    },
                },
                orderBy: {
                    [sortBy]: order,
                },
                skip,
                take: parsedLimit,
            }),
            prisma.product.count({ where }),
        ]);

        const response = {
            success: true,
            data: products,
            pagination: {
                total,
                page: parsedPage,
                limit: parsedLimit,
                totalPages: Math.ceil(total / parsedLimit),
            },
        };

        await redis.set(cacheKey, JSON.stringify(response), "EX", 300);
        console.log("Products served from database");

        res.json(response);
    } catch (error) {
        next(error);
    }
};
// ──────────────────────────────────
// GET /api/products/:id
// ──────────────────────────────────
const getProductById = async (req, res, next) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { category: true },
        });
        if (!product) return res.status(404).json({
            success: false, message: "Không tìm thấy sản phẩm"
        });
        res.json({ success: true, data: product });
    } catch (error) { next(error); }
};
// ──────────────────────────────────
// POST /api/products
// ──────────────────────────────────
const createProduct = async (req, res, next) => {
    try {

        const { name, price, description, stock, imageUrl, categoryId } = req.body;
        const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        const product = await prisma.product.create({
            data: { name, slug, price, description, stock, imageUrl, categoryId },
            include: { category: true }
        });

        await clearProductsCache();

        res.status(201).json({
            success: true, data: product, message: "Tạo sản phẩm thành công"
        });
    } catch (error) { next(error); }
};
// ──────────────────────────────────
// PUT /api/products/:id
// ──────────────────────────────────
const updateProduct = async (req, res, next) => {
    try {
        const product = await prisma.product.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
            include: { category: true }
        });

        await clearProductsCache();

        res.json({ success: true, data: product, message: "Cập nhật thành công" });
    } catch (error) { next(error); }
};
// ──────────────────────────────────
// DELETE /api/products/:id (Soft delete)
// ──────────────────────────────────
const deleteProduct = async (req, res, next) => {
    try {
        await prisma.product.update({
            where: { id: parseInt(req.params.id) },
            data: { isActive: false } // Soft delete — không xoá thật
        });

        await clearProductsCache();

        res.json({ success: true, message: "Đã ẩn sản phẩm thành công" });
    } catch (error) { next(error); }
};

const uploadProductImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng chọn file ảnh",
            });
        }

        const productId = parseInt(req.params.id, 10);

        const product = await prisma.product.update({
            where: { id: productId },
            data: {
                imageUrl: req.file.path,
            },
        });

        await clearProductsCache();

        res.json({
            success: true,
            message: "Upload ảnh thành công",
            data: {
                id: product.id,
                imageUrl: product.imageUrl,
            },
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getProducts, getProductById, createProduct, updateProduct,
    deleteProduct, uploadProductImage,
};
