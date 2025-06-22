import express from 'express';
import {
  createDisaster,
  getDisasters,
  updateDisaster,
  deleteDisaster
} from '../controllers/disasters.js';
import { getDisasterSocialMediaReports } from '../controllers/socialMedia.js';


const router = express.Router();

// Routes
router.post('/', createDisaster);
router.get('/', getDisasters);
router.put('/:id', updateDisaster);
router.delete('/:id', deleteDisaster);
router.get('/:id/social-media', getDisasterSocialMediaReports);


export default router;
