import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./dbConnection.js";
import dotenv from "dotenv";
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';
import userRoute from "./routes/userRoutes.js";
import issueRoute from "./routes/issueRoutes.js";
import commentRoute from "./routes/commentRoutes.js";
import path from "path";
import exp from "constants";

const app = express();
dotenv.config();

const _dirname = path.resolve();

//file upload & cloudinary set-up..
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir : '/tmp/',
})) 
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    origin : "https://community-problem-tracker-3.onrender.com/",
    credentials: true  // enable set cookie
}));
app.use(express.json());

//database connection.....
dbConnection();

app.use('/api/v1/user', userRoute);
app.use('/api/v1/issues', issueRoute);
app.use('/api/v1/comment', commentRoute);

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get('*'  , (_, res) => {
    res.sendFile(path.resolve(_dirname, 'frontend' , 'dist' , 'index.html'));
})

const PORT = process.env.PORT;
app.listen(PORT , () => {
    console.log(`Server running on port ${PORT}`);
});

