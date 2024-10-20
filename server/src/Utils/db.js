import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
    // console.log("🚀 ~ connectDB ~ db:", db);
    console.log("DB connect ");
  } catch (error) {
    throw error;
  }
};

export default connectDB;
