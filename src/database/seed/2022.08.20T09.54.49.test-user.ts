/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import Sequelize, { QueryInterface } from 'sequelize';

export const up = async ({ queryInterface }: any) => {
  console.log('CONTEXT: ', queryInterface);
};

export const down = async ({ context: queryInterface }: any) => {};
