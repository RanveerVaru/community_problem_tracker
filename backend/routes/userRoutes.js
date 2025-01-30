import express from "express";
import { deleteUser, getAllUsers, login, logout, signup } from "../controllers/userController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post('/signup' , signup);
router.post('/login' , login);
router.get('/logout' , logout);

router.get('/all-users' , authMiddleware , getAllUsers);
router.delete('/delete-user/:id' , authMiddleware , deleteUser);

export default router;