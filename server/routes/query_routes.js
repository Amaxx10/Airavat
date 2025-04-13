import express from 'express';
import { get_query, upload } from '../controllers/query_controller.js';
const router = express.Router();

router.post('/query', upload.single('image'), get_query);

export default router;