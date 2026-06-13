import { type Response } from 'express';
import { Op, ForeignKeyConstraintError } from 'sequelize';
import { Booking, Room } from '../models/index.js';
import { type AuthRequest } from '../middlewares/auth.js';

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { room_id, start_time, end_time } = req.body;
    let { user_id } = req.body; 

    // Check who is making the request
    if (req.user?.role === 'user') {
      user_id = req.user.id;
    } else if (req.user?.role === 'admin') {
      if (!user_id) {
        user_id = req.user.id;
      }
    }

    if (!room_id || !user_id || !start_time || !end_time) {
      res.status(400).json({ message: 'Fields room_id, start_time and end_time are required' });
      return;
    }

    const start = new Date(start_time);
    const end = new Date(end_time);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ message: 'Invalid start_time or end_time format. Use ISO 8601, e.g. 2026-06-20T10:00:00.000Z' });
      return;
    }

    // Validation of dates
    if (start >= end) {
      res.status(400).json({ message: 'End time must be later than start time' });
      return;
    }
    if (start < new Date()) {
      res.status(400).json({ message: 'Cannot create booking in the past' });
      return;
    }

    // Check if room exists
    const room = await Room.findByPk(room_id);
    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    // Check for conflicts by time
    const conflictingBooking = await Booking.findOne({
      where: {
        room_id,
        [Op.and]: [
          { start_time: { [Op.lt]: end } },
          { end_time: { [Op.gt]: start } }
        ]
      }
    });

    if (conflictingBooking) {
      res.status(409).json({ message: 'Conflict: room is already booked for this time' });
      return;
    }

    // Create booking
    const booking = await Booking.create({
      room_id,
      user_id, 
      start_time: start,
      end_time: end
    });

    res.status(201).json({ message: 'Booking successfully created', booking });
  } catch (error) {
    console.error(error);
    if (error instanceof ForeignKeyConstraintError) {
      res.status(400).json({ message: 'Invalid room_id or user_id' });
      return;
    }
    res.status(500).json({ message: 'Server error during booking creation' });
  }
};