import { Router } from 'express';
import { getHistory } from '../controllers/history.controller';
import { authorized } from '../middleware/auth.middleware';

const router = Router();

router.get('/history', authorized, getHistory);

export default router; 