import db from "../../common-modules/server/config/knex";
import { server } from "../app";

beforeAll(async () => {
  await db.migrate.latest();
});

afterAll(async () => {
  await stopServer(server);
  await db.destroy();
});

function stopServer(server) {
  return new Promise((resolve, reject) => {
    server.close(err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}