import { DataTypes, Model, type Optional } from 'sequelize';
import { sequelize } from '../config/db.js';

interface BookingAttributes {
  id: number;
  room_id: number;
  user_id: number;
  start_time: Date;
  end_time: Date;
}

interface BookingCreationAttributes extends Optional<BookingAttributes, 'id'> {}

class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public id!: number;
  public room_id!: number;
  public user_id!: number;
  public start_time!: Date;
  public end_time!: Date;
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
    tableName: 'bookings',
  }
);

export default Booking;