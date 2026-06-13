import { DataTypes, Model, type Optional } from 'sequelize';
import { sequelize } from '../config/db.js';

interface UserAttributes {
  id: number;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role'> {}

  class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public passwordHash!: string;
  public role!: 'admin' | 'user';
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    tableName: 'users',
  }
);

export default User;