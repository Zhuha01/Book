import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../config/db.js";

interface UserAttributes {
  id: number;
  email: string;
  passwordHash: string;
  role: "admin" | "user";
}

interface UserCreationAttributes extends Optional<
  UserAttributes,
  "id" | "role"
> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare email: string;
  declare passwordHash: string;
  declare role: "admin" | "user";
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
    },
  },
  {
    sequelize,
    tableName: "users",
  },
);

export default User;
