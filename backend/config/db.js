const mongoose = require('mongoose');

let isDBConnected = false;

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI || "mongodb://localhost:27017/vyomarr";

    await mongoose.connect(dbURI);
    console.log('✅ MongoDB Connected Successfully');
    isDBConnected = true;

    // Start the article scheduler after DB connection
    const { startScheduler } = require('../services/scheduler');
    startScheduler();
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('⚠️  Server will continue running, but database operations will fail.');
    console.error('💡 TIP: Make sure your IP is whitelisted in MongoDB Atlas!');
    isDBConnected = false;
  }
};

const getConnectionStatus = () => isDBConnected;

module.exports = { connectDB, getConnectionStatus };

