import { Router } from 'express';
import { createBooking } from '../controllers/booking.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/', authenticate, createBooking);

export default router;