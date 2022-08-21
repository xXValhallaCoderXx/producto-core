import 'dotenv/config';
import path = require('path');
import fs = require('fs');
import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

(async () => {
  const umzug = new Umzug({
    migrations: {
      glob: path.resolve(__dirname, '../database/seed/*.ts'),
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({
      sequelize,
      modelName: 'SequelizeSeedMeta',
    }),
    logger: console,
    create: {
      folder: path.resolve(__dirname, '../database/seed'),
      template: (filepath) => [
        [
          filepath,
          fs
            .readFileSync(path.join(__dirname, './umzug-template.ts'))
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
    console.log('Running Seeds');
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
