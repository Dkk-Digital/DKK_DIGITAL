import mongoose from 'mongoose';

let cachedConnectionPromise = null;

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set. Configure it in your deployment environment.');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnectionPromise) {
    return cachedConnectionPromise;
  }

  try {
    cachedConnectionPromise = mongoose.connect(mongoUri);
    const conn = await cachedConnectionPromise;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    cachedConnectionPromise = null;
    console.error(`Error: ${error.message}`);
    throw error;
  }
};
