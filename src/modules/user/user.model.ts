import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Task } from '../task/task.model';
// import { Exclude } from 'class-transformer';

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
  // @Exclude()
  password: string;

  @HasMany(() => Task)
  tasks: Task[];
}
