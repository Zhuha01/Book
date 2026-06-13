import { type Request, type Response } from 'express';
import  Room  from '../models/Room.js';

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