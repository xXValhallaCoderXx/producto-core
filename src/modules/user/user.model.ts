import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
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

  @HasMany(() => Task)
  tasks: Task[];
}
