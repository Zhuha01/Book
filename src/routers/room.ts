import { Router } from 'express';
import { createRoom } from '../controllers/room.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.post('/', authenticate, authorize(['admin']), createRoom);

export default router;