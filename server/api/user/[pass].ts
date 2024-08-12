import { UserDatabase } from "~~/server/db/database";

export default defineEventHandler(async (event) => {
  if (event.method !== "GET") {
    return null;
  }

  const db = new UserDatabase();
  await db.initialize();

  const passKey = getRouterParam(event, "pass") || "";
  const user = await db.getUserViaPass(passKey);

  if (!user) {
    return null;
  }

  const imageIds = (await db.getImageIds(user.id)).map(
    (obj) => obj.id
  );
  const starRatingTotals: number[] = [];

  const comments = await Promise.all(
    imageIds.map(async (imageId) => {
      const commentsData = await db.getCommentsById(imageId);
      return commentsData.map((obj) => obj.comment);
    })
  );

  const ratings = await Promise.all(
    imageIds.map(async (imageId) => {
      const stars = await db.getStarsById(imageId);
      starRatingTotals.push(stars.length);
      return stars.length > 0
        ? stars.reduce((a, b) => a + b.starRating, 0) / stars.length
        : 0;
    })
  );

  return {
    user,
    starRatingAverages: ratings,
    imageIds,
    starRatingTotals: starRatingTotals,
    comments,
  };
});
