import express from 'express';
import { get_query, get_product_links } from '../controllers/query_controller.js';
const router = express.Router();

router.post('/get_query', get_query);
router.post('/get_product_links', get_product_links);

export default router;