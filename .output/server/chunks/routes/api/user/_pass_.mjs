import { d as defineEventHandler, U as UserDatabase, e as getRouterParam, s as setResponseStatus } from '../../../runtime.mjs';
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

const _pass_ = defineEventHandler(async (event) => {
  const db = await UserDatabase.getInstance();
  const passKey = getRouterParam(event, "pass") || "";
  const user = await db.getUserViaPass(passKey);
  if (!user) {
    setResponseStatus(event, 404);
    return { error: "User not found" };
  }
  try {
    const imageIds = (await db.getImageIds(user.id)).map((obj) => obj.id);
    const comments = await getCommentsForImages(db, imageIds);
    const { starRatingAverages, starRatingTotals } = await getStarRatingsForImages(
      db,
      imageIds
    );
    setResponseStatus(event, 200);
    return {
      error: null,
      data: {
        user,
        starRatingAverages,
        imageIds,
        starRatingTotals,
        comments
      }
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    setResponseStatus(event, 500);
    return { error: "Error fetching user data" };
  }
});
async function getCommentsForImages(db, imageIds) {
  return Promise.all(
    imageIds.map(async (imageId) => {
      const commentsData = await db.getCommentsById(imageId);
      return commentsData.map((obj) => obj.comment);
    })
  );
}
async function getStarRatingsForImages(db, imageIds) {
  const starRatingTotals = [];
  const starRatingAverages = [];
  await Promise.all(
    imageIds.map(async (imageId) => {
      starRatingTotals.push(await db.getTotalStarsCount(imageId));
      starRatingAverages.push(await db.getAverageStarRating(imageId));
    })
  );
  return { starRatingAverages, starRatingTotals };
}

export { _pass_ as default };
//# sourceMappingURL=_pass_.mjs.map
