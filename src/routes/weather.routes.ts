import { Router } from 'express';
import { getWeather } from '../controllers/weather.controller';
import { authorized } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get('/weather', authorized, getWeather);

export default router; 