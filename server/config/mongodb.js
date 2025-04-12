import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongodbURL = process.env.MONGODB_URL;

const mongoConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

export { mongoose, mongodbURL, mongoConfig };
