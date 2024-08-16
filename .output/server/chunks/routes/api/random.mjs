import { d as defineEventHandler, U as UserDatabase, b as getQuery, s as setResponseStatus } from '../../runtime.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'cron';
import 'fs/promises';
import 'crypto';
import 'promised-sqlite3';
import 'sqlite3';
import 'dotenv';
import 'node:fs';
import 'node:url';
import '@iconify/utils';
import 'consola/core';

const random = defineEventHandler(async (event) => {
  const db = await UserDatabase.getInstance();
  const query = getQuery(event);
  const fetchedUserIdsParam = query.fetchedUserIds || "";
  if (typeof fetchedUserIdsParam != "string")
    return;
  const fetchedUserIds = fetchedUserIdsParam.split(",").filter((id) => id);
  const fetchedUserIdsSet = new Set(fetchedUserIds);
  const randomData = await db.getRandomImageIds(fetchedUserIdsSet);
  setResponseStatus(event, 200);
  return {
    data: {
      randomUsers: randomData
    }
  };
});

export { random as default };
//# sourceMappingURL=random.mjs.map
