import { Router } from 'express';
import { createBooking, deleteBooking } from '../controllers/booking.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/', authenticate, createBooking);
router.delete('/:id', authenticate, deleteBooking);

export default router;