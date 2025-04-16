import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionString = await mongoose.connect(process.env.MONGO_URI + DB_NAME)
        console.log("\nMongoDB Connection Successful. DB-Host:", connectionString.connection.host);
    } catch (error) {
        console.log("MongoDB Connection failed. ", error);
        process.exit(1);
    }
}

export default connectDB;