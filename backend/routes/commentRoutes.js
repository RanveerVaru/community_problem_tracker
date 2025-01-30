import express from "express";
import {authMiddleware} from "../middlewares/authMiddleware.js";
import { addComment, deleteComment, getAllComments } from "../controllers/commentController.js";

const router = express.Router();

router.post('/add-comment/:id' ,authMiddleware , addComment);
router.delete('/delete-comment/:id' , authMiddleware , deleteComment);
router.get('/get-all-comments/:id' , getAllComments);

export default router;