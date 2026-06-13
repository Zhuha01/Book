import { Router } from 'express';
import { createRoom, getAvailableRooms } from '../controllers/room.js';
import { authenticate, authorize } from '../middlewares/auth.js'; 

const router = Router();

router.post('/', authenticate, authorize(['admin']), createRoom);
router.get('/available', authenticate, getAvailableRooms);

export default router;