import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/connectdb.js';
import dotenv from 'dotenv';
import query_routes from './routes/query_routes.js';

const port = process.env.PORT || 3000;
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


app.use('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

app.use('/query',query_routes);
app.listen(port, async () => {
    try {
        await connectDB();
        console.log(`Server running at http://localhost:${port}`);
    } catch (err) {
        console.error("Error starting server:", err.message);
    }
});
