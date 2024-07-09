import express from "express";
import { 
    createUser,
    updateUser,
    deleteUser,
    getUsers,
 } from "../controllers/userController";

 const router = express.Router();

// Route to create a new user
router.post('/api/users', createUser);

// Route to get all users
router.get('/api/users', getUsers);

// Route to delete a user by ID
router.delete('/api/users/:id', deleteUser);

// Route to update a user by ID
router.put('/api/users/:id', updateUser);

export default router;