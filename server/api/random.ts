import { UserDatabase } from "../db/database";

export default defineEventHandler(async (event) => {
  if (event.method !== "GET") {
    return { error: "Invalid request method" };
  }

  const dbInstance = UserDatabase.getInstance();
  const randomData = await dbInstance.getRandomData();

  return { imageSrc: randomData.imageSrc, userName: randomData.userName };
});
