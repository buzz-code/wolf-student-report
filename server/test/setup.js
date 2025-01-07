import knex from 'knex';

const dbConfig = {
  client: 'better-sqlite3',
  connection: {
    filename: ':memory:',
  },
  useNullAsDefault: true,
  migrations: {
    directory: './server/test/migrations'
  }
};

jest.mock('../../common-modules/server/config/database', () => dbConfig);

let db;

beforeAll(async () => {
  // Create new in-memory database connection
  db = knex(dbConfig);

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