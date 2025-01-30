import express from "express";
import { createIssue, deleteIssue, getAllIssues, getIssueById, getMyIssues, searchIssue, updateIssue } from "../controllers/issueController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/create' , authMiddleware , createIssue);
router.get('/get-all-issues' , getAllIssues);
router.get('/get-issue/:id' , getIssueById);
router.get('/get-my-issues' , authMiddleware ,getMyIssues);
router.get('/search'  , searchIssue);
router.put('/update/:id' , authMiddleware , updateIssue);
router.delete('/delete/:id' , authMiddleware , deleteIssue);


export default router;