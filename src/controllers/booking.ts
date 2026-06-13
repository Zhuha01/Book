import { type Response } from "express";
import { Booking, Room } from "../models/index.js";
import { type AuthRequest } from "../middlewares/auth.js";
import { parseTimeRange } from "../utils/timeValidation.js";
import { findRoomConflict } from "../utils/bookingOverlap.js";

export const createBooking = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const { room_id, start_time, end_time } = req.body;
  let { user_id } = req.body;

  // Admin assigns user_id; users self-book
  if (req.user?.role === "user") {
    user_id = req.user.id;
  } else if (req.user?.role === "admin") {
    if (!user_id) {
      user_id = req.user.id;
    }
  }

  if (!room_id || !user_id || !start_time || !end_time) {
    res
      .status(400)
      .json({
        message: "Fields room_id, start_time and end_time are required",
      });
    return;
  }

  const timeRange = parseTimeRange(start_time, end_time);
  if (!timeRange.ok) {
    res.status(400).json({ message: timeRange.message });
    return;
  }

  const { start, end } = timeRange;

  if (start < new Date()) {
    res.status(400).json({ message: "Cannot create booking in the past" });
    return;
  }

  const room = await Room.findByPk(room_id);
  if (!room) {
    res.status(404).json({ message: "Room not found" });
    return;
  }

  // Overlap check for room time slot
  const conflictingBooking = await findRoomConflict(room_id, start, end);

  if (conflictingBooking) {
    res
      .status(409)
      .json({ message: "Conflict: room is already booked for this time" });
    return;
  }

  const booking = await Booking.create({
    room_id,
    user_id,
    start_time: start,
    end_time: end,
  });

  res.status(201).json({ message: "Booking successfully created", booking });
};

export const deleteBooking = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    res.status(400).json({ message: "Invalid booking id" });
    return;
  }

  const booking = await Booking.findByPk(id);

  if (!booking) {
    res.status(404).json({ message: "Booking not found" });
    return;
  }

  if (req.user?.role === "user") {
    if (booking.user_id !== req.user.id) {
      res
        .status(403)
        .json({
          message: "Access denied: you can only delete your own bookings",
        });
      return;
    }

    const now = new Date();
    if (new Date(booking.start_time) <= now) {
      res.status(400).json({ message: "You can only cancel future bookings" });
      return;
    }
  }

  await booking.destroy();

  res.status(200).json({ message: "Booking successfully canceled" });
};

export const getAllBookings = async (
  _req: AuthRequest,
  res: Response,
): Promise<void> => {
  const bookings = await Booking.findAll({
    order: [["start_time", "DESC"]],
  });

  res.status(200).json(bookings);
};
