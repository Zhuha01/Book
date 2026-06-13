import { Router } from 'express';
import { createBooking, deleteBooking, getAllBookings } from '../controllers/booking.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/', authenticate, asyncHandler(createBooking));
router.delete('/:id', authenticate, asyncHandler(deleteBooking));
router.get('/', authenticate, authorize(['admin']), asyncHandler(getAllBookings));

export default router;
