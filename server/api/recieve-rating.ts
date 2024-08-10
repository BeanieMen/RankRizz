import { defineEventHandler, readMultipartFormData } from "h3";
import { UserDatabase } from "../db/database";

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    return { message: "Invalid request method" };
  }

  const db = new UserDatabase();
  await db.initialize();

  const form = await readMultipartFormData(event);

  if (!form) {
    return { message: "No form data received" };
  }

  const userId = form.find((field) => field.name === "userId")?.data?.toString();
  const starRating = Number(form.find((field) => field.name === "starRating")?.data?.toString());
  const comment = form.find((field) => field.name === "comment")?.data?.toString();

  if (!userId || (!comment && isNaN(starRating))) {
    return { message: "Invalid form data" };
  }

  if (comment) {
    await db.addComment(userId, comment);
  }

  if (!isNaN(starRating)) {
    await db.createStar(userId, starRating);
  }

  return { message: "Successfully uploaded ratings" };
});
