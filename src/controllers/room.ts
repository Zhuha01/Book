import { type Request, type Response } from 'express';
import { Op } from 'sequelize';
import Room from '../models/Room.js';
import { parseTimeRange } from '../utils/timeValidation.js';
import { getOccupiedRoomIds } from '../utils/bookingOverlap.js';

export const createRoom = async (req: Request, res: Response): Promise<void> => {
  const { name, capacity } = req.body;

  if (!name || !capacity) {
    res.status(400).json({ message: 'Name and capacity are required' });
    return;
  }

  const existingRoom = await Room.findOne({ where: { name } });
  if (existingRoom) {
    res.status(400).json({ message: 'Room with this name already exists' });
    return;
  }

  const room = await Room.create({ name, capacity });

  res.status(201).json({ message: 'Room successfully created', room });
};

export const getAvailableRooms = async (req: Request, res: Response): Promise<void> => {
  const { start_time, end_time } = req.query;

  if (!start_time || !end_time) {
    res.status(400).json({ message: 'Parameters start_time and end_time are required in query' });
    return;
  }

  const timeRange = parseTimeRange(start_time, end_time);
  if (!timeRange.ok) {
    res.status(400).json({ message: timeRange.message });
    return;
  }

  const { start, end } = timeRange;
  const occupiedRoomIds = await getOccupiedRoomIds(start, end);

  const availableRooms = await Room.findAll({
    where: occupiedRoomIds.length > 0 ? { id: { [Op.notIn]: occupiedRoomIds } } : {},
  });

  res.status(200).json(availableRooms);
};
