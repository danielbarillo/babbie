import express from 'express';
import { getAllUsers } from '../controllers/userController'; // Ensure this path is correct

const router = express.Router();

router.get('/users', getAllUsers); // This should reference the imported function

export default router; 