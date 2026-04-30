import mongoose from "mongoose";
import debug from "debug";
import { DB_Name } from "../constants.js";

const log = debug("development:mongoose");
const dbConnection = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_Name}`
    );
    log(`MongoDB DB_HOST: ${connectionInstance.connection.host} is connected`);
  } catch (error) {
    log(`Error in connecting to database: ${error.message}`);
    console.error('Critical failure, shutting down the application...');
    process.exit(1);
  }
};

export default dbConnection;
