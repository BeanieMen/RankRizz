import { UserDatabase, generateRandomString } from "../db/database";

export default defineEventHandler(async (event) => {
  const dbInstance = UserDatabase.getInstance();

  if (event.method !== "POST") {
    return { passKey: null, username: null, error: "Invalid request method" };
  }

  const body = await readBody(event);
  const username = body.username;

  if (!username) {
    return { passKey: null, username: null, error: "Username is required" };
  }

  const passKey = generateRandomString();
  const user = await dbInstance.createUser(username, passKey);

  if (!user) {
    return {
      passKey: null,
      username: null,
      error: "Username is already taken",
    };
  }

  return { passKey: passKey, username: username, error: null };
});
