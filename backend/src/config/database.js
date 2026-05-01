import mongoose from 'mongoose';

let cachedConnectionPromise = null;

export const connectDB = async ({ requireEnv = false } = {}) => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    const msg = 'MONGODB_URI is not set.';
    if (requireEnv) throw new Error(msg);
    console.warn(`${msg} Database connection skipped.`);
    return null;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnectionPromise) {
    return await cachedConnectionPromise;
  }

  try {
    mongoose.set('strictQuery', true);
    cachedConnectionPromise = mongoose.connect(mongoUri);
    const conn = await cachedConnectionPromise;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection || mongoose.connection;
  } catch (error) {
    cachedConnectionPromise = null;
    const isSrvLookupError = error && error.syscall === 'querySrv';
    if (isSrvLookupError) {
      const hint = 'SRV DNS lookup failed. If you are using a mongodb+srv URI, try using the standard (mongodb://) connection string from Atlas or verify DNS resolution for your cluster.';
      console.warn(`Database connection unavailable: ${error.message}. ${hint}`);
      if (requireEnv) throw new Error(`${error.message}. ${hint}`);
      return null;
    }

    console.warn(`Database connection unavailable: ${error.message}`);
    if (requireEnv) throw error;
    return null;
  }
};
