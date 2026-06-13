import { Router } from "express";
import { createRoom, getAvailableRooms } from "../controllers/room.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/", authenticate, authorize(["admin"]), asyncHandler(createRoom));
router.get("/available", authenticate, asyncHandler(getAvailableRooms));

export default router;
