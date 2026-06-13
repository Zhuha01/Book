import { DataTypes, Model, type Optional } from 'sequelize';
import { sequelize } from '../config/db.js';

interface RoomAttributes {
  id: number;
  name: string;
  capacity: number;
}

interface RoomCreationAttributes extends Optional<RoomAttributes, 'id'> {}

class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
  declare id: number;
  declare name: string;
  declare capacity: number;
}

Room.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  },
  {
    sequelize,
    tableName: 'rooms',
  }
);

export default Room;