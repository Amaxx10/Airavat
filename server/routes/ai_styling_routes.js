import express from 'express';
import { get_aiStyling, virtual_tryon } from '../controllers/ai_styling_controller.js';

const router = express.Router();

router.post('/ai_styling', get_aiStyling);  // Changed to POST
router.post('/virtual_tryon', virtual_tryon);  // Changed to POST

export default router;