import { type Request, type Response, type NextFunction } from "express";
import { ForeignKeyConstraintError } from "sequelize";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error(error);

  if (error instanceof ForeignKeyConstraintError) {
    res.status(400).json({ message: "Invalid room_id or user_id" });
    return;
  }

  res.status(500).json({ message: "Internal server error" });
};
