import { defineEventHandler, readFormData, getRequestHeader, setResponseStatus } from "h3";
import { UserDatabase } from "../db/database";

export default defineEventHandler(async (event) => {
  const db = await UserDatabase.getInstance();
  const ipAddress = getRequestHeader(event, "x-forwarded-for") ?? "";

  const form = await readFormData(event);
  if (!form) {
    setResponseStatus(event, 400);
    return { error: "Form data is missing" };
  }

  const starRating = Number(form.get('starRating')?.toString());
  const comment = form.get('comment')?.toString();
  const imageId = form.get('imageId')?.toString();

  if (!imageId) {
    setResponseStatus(event, 400);
    return { error: "Image ID is missing" };
  }

  const isRated = await db.getRatingLookup(imageId);

  if (!imageId || (!comment && isNaN(starRating))) {
    setResponseStatus(event, 400);
    return { error: "Missing or invalid rating/comment" };
  }

  if (comment) {
    if (!isRated?.commented) {
      await db.addComment(imageId, comment);
      await db.upsertRatingLookup(ipAddress, imageId, true, isRated?.starRated ?? false);
    } else {
      setResponseStatus(event, 409);
      return { error: "Duplicate comment" };
    }
  }

  if (!isNaN(starRating)) {
    if (!isRated?.starRated) {
      await db.createStar(imageId, starRating);
      await db.upsertRatingLookup(ipAddress, imageId, isRated?.commented ?? false, true);
    } else {
      setResponseStatus(event, 409);
      return { error: "Duplicate rating" };
    }
  }

  setResponseStatus(event, 200);
  return { message: "Successfully uploaded ratings", error: null };
});
