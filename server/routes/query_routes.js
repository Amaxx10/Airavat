import express from 'express';
import { get_query } from '../controllers/query_controller.js';
const router = express.Router();

router.post('/get_query', get_query);

export default router;