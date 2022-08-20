/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import Sequelize, { QueryInterface } from 'sequelize';
import { User } from '../../modules/user/user.model';
interface IMigrationParams {
  context: QueryInterface;
}
export const up = async (hello: any) => {
  console.log("LALA: ", hello)
  // return queryInterface.bulkInsert('Users', [
  //   {
  //     username: 'nate-1',
  //     password: '123456',
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  // ]);
};

export const down = async ({ context: queryInterface }: IMigrationParams) => {
  return queryInterface.bulkDelete('User', null, {});
};
