import { type Response } from 'express'
import { Op, Transaction } from 'sequelize'
import { sequelize } from '../config/db.js'
import { Booking, Room } from '../models/index.js'
import { type AuthRequest } from '../middlewares/auth.js'
import { parseTimeRange } from '../utils/timeValidation.js'
import { findRoomConflict } from '../utils/bookingOverlap.js'

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  const { room_id, start_time, end_time } = req.body
  let { user_id } = req.body

  if (req.user?.role === 'user') {
    user_id = req.user.id
  } else if (req.user?.role === 'admin' && !user_id) {
    user_id = req.user.id
  }

  if (!room_id || !user_id || !start_time || !end_time) {
    res.status(400).json({ message: 'Fields room_id, start_time and end_time are required' })
    return
  }

  const start = new Date(start_time)
  const end = new Date(end_time)

  if (start >= end || start < new Date()) {
    res.status(400).json({ message: 'Invalid booking time' })
    return
  }

  const t = await sequelize.transaction()

  try {
    const room = await Room.findByPk(room_id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    })

    if (!room) {
      await t.rollback()
      res.status(404).json({ message: 'Room not found' })
      return
    }

    const conflictingBooking = await Booking.findOne({
      where: {
        room_id,
        [Op.and]: [{ start_time: { [Op.lt]: end } }, { end_time: { [Op.gt]: start } }],
      },
      transaction: t,
    })

    if (conflictingBooking) {
      await t.rollback()
      res.status(409).json({ message: 'Conflict: room is already booked for this time' })
      return
    }

    const booking = await Booking.create(
      {
        room_id,
        user_id,
        start_time: start,
        end_time: end,
      },
      { transaction: t },
    )

    await t.commit()

    res.status(201).json({ message: 'Booking successfully created', booking })
  } catch (error: any) {
    const tx = t as Transaction & { finished?: string }
    if (!tx.finished) await tx.rollback()
    console.error(error)

    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ message: 'You already have exactly the same booking' })
      return
    }

    res.status(500).json({ message: 'Server error during creating booking' })
  }
}

export const deleteBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params

  if (!id || Array.isArray(id)) {
    res.status(400).json({ message: 'Invalid booking id' })
    return
  }

  const booking = await Booking.findByPk(id)

  if (!booking) {
    res.status(404).json({ message: 'Booking not found' })
    return
  }

  if (req.user?.role === 'user') {
    if (booking.user_id !== req.user.id) {
      res.status(403).json({
        message: 'Access denied: you can only delete your own bookings',
      })
      return
    }

    const now = new Date()
    if (new Date(booking.start_time) <= now) {
      res.status(400).json({ message: 'You can only cancel future bookings' })
      return
    }
  }

  await booking.destroy()

  res.status(200).json({ message: 'Booking successfully canceled' })
}

export const getAllBookings = async (_req: AuthRequest, res: Response): Promise<void> => {
  const bookings = await Booking.findAll({
    order: [['start_time', 'DESC']],
  })

  res.status(200).json(bookings)
}
