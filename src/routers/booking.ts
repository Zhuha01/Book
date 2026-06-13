import { Router } from 'express';
import { createBooking, deleteBooking, getAllBookings } from '../controllers/booking.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.post('/', authenticate, createBooking);
router.delete('/:id', authenticate, deleteBooking);
router.get('/', authenticate, authorize(['admin']), getAllBookings);

export default router;