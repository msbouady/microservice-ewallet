import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

let client;
let usersCollection;

export const connectClient = async () => {
  try {
    client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    usersCollection = client.db().collection("users");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error.message);
    throw error;
  }
};

export const closeClient = async () => {
  try {
    await client.close();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Failed to disconnect from MongoDB", error.message);
    throw error;
  }
};

export { usersCollection };
