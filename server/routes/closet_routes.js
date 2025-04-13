import express from 'express';
import { upload, uploadImage, get_images } from '../controllers/closet_controller.js';

const router = express.Router();

router.post('/upload', upload.single('image'), uploadImage);
router.get('/get_images', get_images);

export default router;