import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../config/db.js";

interface BookingAttributes {
  id: number;
  room_id: number;
  user_id: number;
  start_time: Date;
  end_time: Date;
}

interface BookingCreationAttributes extends Optional<BookingAttributes, "id"> {}

class Booking
  extends Model<BookingAttributes, BookingCreationAttributes>
  implements BookingAttributes
{
  declare id: number;
  declare room_id: number;
  declare user_id: number;
  declare start_time: Date;
  declare end_time: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "bookings",
  },
);

export default Booking;
