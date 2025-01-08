const dbConfig = {
  client: 'sqlite3',
  connection: {
    filename: ':memory:',
  },
  useNullAsDefault: true,
  migrations: {
    directory: './server/test/migrations'
  }
};

jest.mock('../../common-modules/server/config/database', () => dbConfig);

import db from "../../common-modules/server/config/knex";

beforeAll(async () => {
  // Run migrations
  await db.migrate.latest();

  // Make db instance available globally for tests
  global.__DB__ = db;
});

afterAll(async () => {
  await db.destroy();
});

// beforeEach(async () => {
//   // Clean tables before each test
//   const tables = ['students', 'teachers', 'att_reports'];
//   for (const table of tables) {
//     await db(table).del();
//   }
// });