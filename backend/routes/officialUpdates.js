// routes/officialUpdates.js
import express from 'express';
import { getOfficialUpdates } from '../controllers/getOfficialUpdates.js';

const router = express.Router();

// Route: /disasters/:id/official-updates
router.get('/:id/official-updates', getOfficialUpdates);

export default router;
