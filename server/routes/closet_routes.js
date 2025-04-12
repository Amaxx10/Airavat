import express from 'express';
import { upload, uploadImage, getImage } from '../controllers/closet_controller.js';

const router = express.Router();

router.post('/upload', upload.single('image'), uploadImage);
router.get('/image/:dress_id', getImage);

export default router;