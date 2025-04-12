import express from 'express';
import { get_aiStyling } from '../controllers/ai_styling_controller.js';

const router = express.Router();

router.get('/ai_styling', get_aiStyling);

export default router;