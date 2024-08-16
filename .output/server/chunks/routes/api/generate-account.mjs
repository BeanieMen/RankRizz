import { d as defineEventHandler, U as UserDatabase, r as readBody, g as getRequestHeader, s as setResponseStatus, a as generateRandomString } from '../../runtime.mjs';
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

const generateAccount = defineEventHandler(async (event) => {
  var _a;
  const db = await UserDatabase.getInstance();
  const body = await readBody(event);
  const username = body.username;
  const ipAddress = (_a = getRequestHeader(event, "x-forwarded-for")) != null ? _a : "";
  if (!username) {
    setResponseStatus(event, 400);
    return { error: "Username is required" };
  }
  const ipLookup = await db.getIpLookupByIpAddress(ipAddress);
  if (ipLookup) {
    setResponseStatus(event, 409);
    return { error: "An account is already associated with this IP address" };
  }
  const existingUser = await db.getUserViaName(username);
  if (existingUser) {
    setResponseStatus(event, 409);
    return { error: "Username is already taken" };
  }
  const passKey = generateRandomString();
  const id = generateRandomString();
  const user = await db.createUser(id, username, passKey);
  if (!user) {
    setResponseStatus(event, 500);
    return { error: "Failed to create user" };
  }
  await db.addIpLookup(ipAddress, id);
  setResponseStatus(event, 201);
  return { data: { passKey, username }, error: null };
});

export { generateAccount as default };
//# sourceMappingURL=generate-account.mjs.map
