import { defineEventHandler, readFormData, getRequestHeader } from "h3";
import { UserDatabase } from "../db/database";

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    return { message: "Invalid request method" };
  }

  const db = new UserDatabase();
  const ipAddress = getRequestHeader(event, "x-forwarded-for") ?? "";
  await db.initialize();

  const form = await readFormData(event);
  if (!form) {
    return { message: "No form data received" };
  }

  const starRating = Number(form.get('starRating')?.toString());
  const comment = form.get('comment')?.toString();
  const imageId = form.get('imageId')?.toString();

  if (!imageId) {
    return { message: "Image source is required" };
  }

  const isRated = await db.getRatingLookup(imageId);

  if (!imageId || (!comment && isNaN(starRating))) {
    return { message: "Invalid form data" };
  }

  if (comment) {
    if (!isRated?.commented) {
      await db.addComment(imageId, comment);
      await db.upsertRatingLookup(
        ipAddress,
        imageId,
        true,
        isRated?.starRated!
      );
    } else {
      return { message: "The user has already commented on this photo" };
    }
  }

  // Handle star rating
  if (!isNaN(starRating)) {
    if (!isRated?.starRated) {
      await db.createStar(imageId, starRating);
      await db.upsertRatingLookup(
        ipAddress,
        imageId,
        isRated?.commented!,
        true
      );
    } else {
      return { message: "The user has already rated this photo" };
    }
  }

  return { message: "Successfully uploaded ratings" };
});
