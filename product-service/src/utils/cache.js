const redis = require("../config/redis");

const PRODUCTS_CACHE_PREFIX = "products:list:";

const buildProductsCacheKey = (query = {}) => {
  const normalized = Object.keys(query)
    .sort()
    .reduce((acc, key) => {
      acc[key] = query[key];
      return acc;
    }, {});

  return `${PRODUCTS_CACHE_PREFIX}${JSON.stringify(normalized)}`;
};

const clearProductsCache = async () => {
  const keys = await redis.keys(`${PRODUCTS_CACHE_PREFIX}*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};

module.exports = {
  redis,
  buildProductsCacheKey,
  clearProductsCache,
};