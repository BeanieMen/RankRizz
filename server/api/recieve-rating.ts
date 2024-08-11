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

  const starRating = Number(form.find((field) => field.name === "starRating")?.data?.toString());
  const comment = form.find((field) => field.name === "comment")?.data?.toString();
  const imageSrc = form.find((field) => field.name === "imageSrc")?.data?.toString();
  const imageId = await db.getImageIdBySrc(imageSrc!)

  if (!imageId || (!comment && isNaN(starRating))) {
    return { message: "Invalid form data" };
  }

  if (comment) {
    await db.addComment(imageId.id, comment);
  }

  if (!isNaN(starRating)) {
    await db.createStar(imageId.id, starRating);
  }

  return { message: "Successfully uploaded ratings" };
});
