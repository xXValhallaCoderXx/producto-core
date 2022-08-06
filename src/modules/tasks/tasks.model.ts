import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table
export class Task extends Model<Task> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  completed: string;
}
