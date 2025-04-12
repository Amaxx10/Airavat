import express from 'express';
import { savePreferences, getPreferences } from '../controllers/preferences_controller.js';

const router = express.Router();

router.post('/preferences', savePreferences);
router.get('/preferences/get', getPreferences);

export default router;
