import { type Response } from 'express';
import { Op } from 'sequelize';
import { Booking } from '../models/index.js';
import { type AuthRequest } from '../middlewares/auth.js';

export const getUserBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  const targetUserId = parseInt(req.params.id as string, 10);

  if (isNaN(targetUserId)) {
    res.status(400).json({ message: 'Invalid user id' });
    return;
  }

  if (req.user?.role === 'user' && req.user.id !== targetUserId) {
    res.status(403).json({ message: 'Access denied: you can only view your own bookings' });
    return;
  }

  // Find only future bookings
  const now = new Date();
  const bookings = await Booking.findAll({
    where: {
      user_id: targetUserId,
      start_time: { [Op.gt]: now },
    },
    order: [['start_time', 'ASC']],
  });

  res.status(200).json(bookings);
};
