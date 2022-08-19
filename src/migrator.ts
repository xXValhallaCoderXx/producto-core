/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');

const sequelize = new Sequelize(
  `postgres://postgres:postgres@localhost:5432/producto`,
);

(async () => {
  const umzug = new Umzug({
    migrations: {
      glob: path.resolve(__dirname, './database/migrations/*.{js,ts}'),
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
    create: {
      folder: path.resolve(__dirname, './database/migrations'),
      template: (filepath) => [
        [
          filepath,
          fs
            .readFileSync(path.join(__dirname, 'config/umzug-template.ts'))
            .toString(),
        ],
      ],
    },
  });
  const action = process.argv[2];
  if (!action) {
    throw new Error('Action is required up | down');
  }
  if (action === 'up') {
    console.log('Running Migrations');
    await umzug.up();
  }

  if (action === 'down') {
    console.log('Running Migrations');
    await umzug.down();
  }

  if (action === 'create') {
    const name = process.argv[3];
    if (!name) {
      throw new Error('Please include a name');
    }
    console.log('Creating Migration');
    await umzug.create({ name: `${name}.ts` });
  }
})().then(() => process.exit());

// export default umzug;
