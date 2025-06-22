import express from 'express';
import { getNearbyResources } from '../controllers/resources.js';

const router = express.Router();

router.get('/:id/resources', getNearbyResources);

export default router;
