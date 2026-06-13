import { type Request, type Response } from 'express';
import  Room  from '../models/Room.js';
import { Booking } from '../models/index.js';
import { Op } from 'sequelize';

export const createRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, capacity } = req.body;

    if (!name || !capacity) {
      res.status(400).json({ message: 'Name and capacity are required' });
      return;
    }

    // Check for uniqueness of name
    const existingRoom = await Room.findOne({ where: { name } });
    if (existingRoom) {
      res.status(400).json({ message: 'Room with this name already exists' });
      return;
    }

    // Create room
    const room = await Room.create({ name, capacity });
    
    res.status(201).json({ message: 'Room successfully created', room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during room creation' });
  }
};

export const getAvailableRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { start_time, end_time } = req.query;

    if (!start_time || !end_time) {
      res.status(400).json({ message: 'Parameters start_time and end_time are required in query' });
      return;
    }

    const start = new Date(start_time as string);
    const end = new Date(end_time as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ message: 'Invalid start_time or end_time format. Use ISO 8601, e.g. 2026-06-20T10:00:00.000Z' });
      return;
    }

    if (start >= end) {
      res.status(400).json({ message: 'End time must be later than start time' });
      return;
    }

    const occupiedBookings = await Booking.findAll({
      where: {
        [Op.and]: [
          { start_time: { [Op.lt]: end } },
          { end_time: { [Op.gt]: start } }
        ]
      },
      attributes: ['room_id'],
      raw: true
    });

    // Make an array of occupied room IDs: [1, 3, 5...]
    const occupiedRoomIds = occupiedBookings.map(b => b.room_id);

    // Get all rooms, IDs of which are not in the array of occupied rooms
    const availableRooms = await Room.findAll({
      where: occupiedRoomIds.length > 0 
        ? { id: { [Op.notIn]: occupiedRoomIds } }
        : {}
    });

    res.status(200).json(availableRooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during getting available rooms' });
  }
};