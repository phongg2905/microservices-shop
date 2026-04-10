// src/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Chưa cấu hình MONGODB_URI");
  }

  const connection = await mongoose.connect(uri, {
    autoIndex: true,
  });
  console.log(`MongoDB connected: ${connection.connection.host}`);
};

module.exports = { connectDB };
