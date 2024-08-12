import { defineEventHandler, readBody, getRequestHeader, setResponseStatus } from "h3";
import { UserDatabase, generateRandomString } from "../db/database";

export default defineEventHandler(async (event) => {
  const db = await UserDatabase.getInstance();
  const body = await readBody(event);
  const username = body.username as string;
  const ipAddress = getRequestHeader(event, "x-forwarded-for") ?? "";

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
  return { data: { passKey: passKey, username: username }, error: null };
});
