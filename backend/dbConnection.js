import mongoose from "mongoose";


export const dbConnection = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    .then(() => {
         console.log("Connected to MongoDB Atlas");
    })
    .catch((err) => {
         console.error("Error connecting to MongoDB Atlas", err);
    })
}

