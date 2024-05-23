import mongoose, { mongo } from "mongoose";

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("connected to MongoDB");
  } catch (error) {
    console.log("error in db/connectToMongoDB ", error.message);
  }
};
