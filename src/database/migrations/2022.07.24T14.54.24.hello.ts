import Sequelize, { QueryInterface } from 'sequelize';

interface IMigrationParams {
  context: QueryInterface;
}

export const up = async ({ context: queryInterface }: IMigrationParams) => {
  await queryInterface.addColumn('Users', 'bio2', {
    type: Sequelize.STRING,
    allowNull: true,
  });
};

export const down = async ({ context: queryInterface }: IMigrationParams) => {
  await queryInterface.removeColumn('Users', 'bio2');
};
