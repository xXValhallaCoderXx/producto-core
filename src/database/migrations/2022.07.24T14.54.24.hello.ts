import Sequelize from 'sequelize';

export const up = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('Users', 'bio2', {
    type: Sequelize.STRING,
    allowNull: true,
  });
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('Users', 'bio2');
};
