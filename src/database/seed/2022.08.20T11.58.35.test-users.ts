/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { QueryInterface } from 'sequelize';

interface IMigrationParams {
  context: QueryInterface;
}
export const up = async ({ context: queryInterface }: IMigrationParams) => {
  const users = [];

  for (let index = 0; index < 5; index++) {
    const name = faker.name.firstName();
    users.push({
      email: faker.internet.email(name),
      password: await bcrypt.hash('123456', 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await queryInterface.bulkInsert('Users', users);
};

export const down = async ({ context: queryInterface }: IMigrationParams) => {
  await queryInterface.bulkDelete('Users', null, {});
};
