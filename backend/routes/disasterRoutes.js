import express from 'express';
import { getOfficialUpdates } from '../controllers/getOfficialUpdates.js';


const router = express.Router();

router.get('/:id/official-updates', getOfficialUpdates);

export default router;
