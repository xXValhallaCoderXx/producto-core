/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import Sequelize, { QueryInterface } from 'sequelize';

interface IMigrationParams {
  context: QueryInterface;
}
export const up = async ({ context: queryInterface }: IMigrationParams) => {
  await queryInterface.bulkInsert('Users', [
    {
      username: 'natey',
      password: '123456',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
};

export const down = async ({ context: queryInterface }: IMigrationParams) => {
  await queryInterface.bulkDelete('Users', null, {});
};
