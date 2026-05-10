import mongoose from 'mongoose';

const connectDB = async (retries = 5) => {
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
      });
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected. Reconnecting...');
        setTimeout(() => connectDB(3), 5000);
      });

      return;
    } catch (error) {
      console.error(`❌ MongoDB attempt ${i}/${retries} failed: ${error.message}`);
      if (i === retries) {
        console.error('All retries exhausted. Exiting.');
        process.exit(1);
      }
      const wait = i * 3000;
      console.log(`Retrying in ${wait / 1000}s...`);
      await new Promise(r => setTimeout(r, wait));
    }
  }
};

export default connectDB;
