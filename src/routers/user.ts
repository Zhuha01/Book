import { Router } from 'express';
import { getUserBookings } from '../controllers/user.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/:id/bookings', authenticate, getUserBookings);

export default router;