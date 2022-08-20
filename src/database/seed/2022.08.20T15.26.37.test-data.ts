/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { QueryInterface } from 'sequelize';
import moment = require('moment');

interface IMigrationParams {
  context: QueryInterface;
}

const TASKS = [
  { title: 'Drink water' },
  { title: 'Skip Skip 15 Min' },
  { title: 'Eat Donut' },
  { title: 'Read book' },
];

export const up = async ({ context: queryInterface }: IMigrationParams) => {
  const tasks = [];

  for (let index = 0; index < TASKS.length; index++) {
    tasks.push({
      title: TASKS[index].title,
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
      completed: 'false',
      deadline:  moment().toISOString(),
      focus: index % 2 === 0 ? true : false,
      userId: 1,
    });
  }

  await queryInterface.bulkInsert('Tasks', tasks);
};

export const down = async ({ context: queryInterface }: IMigrationParams) => {
  await queryInterface.bulkDelete('Tasks', null, {});
};
