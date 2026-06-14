const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Enable strict mode for queries to avoid deprecation warnings
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fincalm_test');
    // conn now holds the Mongoose connection
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
