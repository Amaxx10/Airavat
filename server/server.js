import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/connectdb.js';
import dotenv from 'dotenv';
import query_routes from './routes/query_routes.js';
import closet_routes from './routes/closet_routes.js';
import preferencesRoutes from './routes/preferences_routes.js';
import aiRoutes from './routes/ai_styling_routes.js';

const port = process.env.PORT || 3000;
const app = express();

dotenv.config();
app.use(express.json());

// Configure CORS
const corsOptions = {
  origin: [process.env.ngrokURL, 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(morgan('dev'));

app.use('/query',query_routes);
app.use('/closet', closet_routes);
app.use('/preference', preferencesRoutes);
app.use('/ai', aiRoutes);

app.listen(port, async () => {
    try {
        await connectDB();
        console.log(`Server running at http://localhost:${port}`);
    } catch (err) {
        console.error("Error starting server:", err.message);
    }
});
