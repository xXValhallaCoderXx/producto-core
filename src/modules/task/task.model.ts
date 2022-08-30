import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
// import { Category } from '../categories/categories.model';

@Table
export class Task extends Model<Task> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  deadline: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  completed: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  focus: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  // @ForeignKey(() => Category)
  // @Column({
  //   type: DataType.INTEGER,
  //   allowNull: false,
  // })
  // categoryId: number;

  // @BelongsTo(() => Category, 'categoryId')
  // category: Category;
}
