import { usersCollection, connectClient } from "../models/userModel";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

// Middleware client is connected before handling any requests
const ensureDbConnection = async (req, res, next) => {
  try {
    await connectClient();
    next();
  } catch (error) {
    console.error("Failed to connect to MongoDB", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const createUser = [
  ensureDbConnection,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const userExists = await usersCollection.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = { name, email, password: hashedPassword };
      const result = await usersCollection.insertOne(newUser);

      res.status(201).json({ message: "User created successfully", userId: result.insertedId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
];

export const getUsers = [
  ensureDbConnection,
  async (req, res) => {
    try {
      const users = await usersCollection.find({}).toArray();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
];

export const deleteUser = [
  ensureDbConnection,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const user = await usersCollection.deleteOne({ _id: new ObjectId(id) });

      if (user.deletedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
];

export const updateUser = [
  ensureDbConnection,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const userExists = await usersCollection.findOne({ _id: new ObjectId(id) });
      if (!userExists) {
        return res.status(404).json({ message: 'User not found' });
      }

      const updatedUser = {};

      if (name) {
        updatedUser.name = name;
      }

      if (email) {
        const emailExists = await usersCollection.findOne({ email });
        if (emailExists && emailExists._id.toString() !== id) {
          return res.status(400).json({ message: 'Email already exists' });
        }
        updatedUser.email = email;
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedUser.password = hashedPassword;
      }

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedUser }
      );

      res.status(200).json({ message: 'User updated successfully', userId: id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
];
