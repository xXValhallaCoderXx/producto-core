import Sequelize, { QueryInterface } from 'sequelize';

interface IMigrationParams {
  context: QueryInterface;
}
export const up = async ({ context: queryInterface }: IMigrationParams) => {};

export const down = async ({ context: queryInterface }: IMigrationParams) => {};
