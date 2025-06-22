import express from 'express';
import { getMockSocialMedia } from '../controllers/socialMedia.js';

const router = express.Router();

// Route: GET /disasters/:id/social-media
router.get('/:id/social-media', getMockSocialMedia);

export default router;
