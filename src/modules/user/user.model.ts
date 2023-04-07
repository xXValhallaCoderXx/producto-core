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

  @Default({ autoMove: false })
  @Column(DataType.JSONB)
  prefs!: object;

  @HasMany(() => Task)
  tasks: Task[];
}
