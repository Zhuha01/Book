import { Router } from "express";
import { getUserBookings } from "../controllers/user.js";
import { authenticate } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/:id/bookings", authenticate, asyncHandler(getUserBookings));

export default router;
