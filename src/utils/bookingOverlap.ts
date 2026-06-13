import { Op, type WhereOptions } from 'sequelize';
import { Booking } from '../models/index.js';

function buildOverlapWhere(start: Date, end: Date, roomId?: number): WhereOptions {
  const overlapCondition: WhereOptions = {
    [Op.and]: [
      { start_time: { [Op.lt]: end } },
      { end_time: { [Op.gt]: start } },
    ],
  };

  return roomId !== undefined ? { room_id: roomId, ...overlapCondition } : overlapCondition;
}

export async function findRoomConflict(roomId: number, start: Date, end: Date) {
  return Booking.findOne({ where: buildOverlapWhere(start, end, roomId) });
}

export async function getOccupiedRoomIds(start: Date, end: Date): Promise<number[]> {
  const occupiedBookings = await Booking.findAll({
    where: buildOverlapWhere(start, end),
    attributes: ['room_id'],
    raw: true,
  });

  return occupiedBookings.map((b) => b.room_id);
}
