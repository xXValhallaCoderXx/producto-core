import {
  Column,
  Model,
  Table,
  DataType,
  HasMany,
  Default,
} from 'sequelize-typescript';
import { Task } from '../task/task.model';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  refeshToken: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  timezone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  otpCode: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  otpExpiry: string;

  @Default({ autoMove: false })
  @Column(DataType.JSONB)
  prefs!: object;

  @HasMany(() => Task)
  tasks: Task[];
}
