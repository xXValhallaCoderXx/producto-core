import {
  Column,
  Model,
  Table,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Task } from '../task/task.model';
import { User } from '../user/user.model';

@Table
export class Category extends Model<Category> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  active: boolean;

  @HasMany(() => Task)
  tasks: Task[];

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;
}
