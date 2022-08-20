/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */
import path = require('path');
import fs = require('fs');
import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';

const sequelize = new Sequelize(
  `postgres://postgres:postgres@localhost:5432/producto`,
);

(async () => {
  const umzug = new Umzug({
    migrations: {
      glob: path.resolve(__dirname, './database/seed/*.{js,ts}'),
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    // @ts-ignore
    storageOptions: {
      modelName: 'SequelizeSeedMeta',
    },
    logger: console,
    create: {
      folder: path.resolve(__dirname, './database/seed'),
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
    console.log('Creating Seed Script');
    await umzug.create({ name: `${name}.ts` });
  }
})().then(() => process.exit());

// export default umzug;
