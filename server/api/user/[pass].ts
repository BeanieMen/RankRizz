import { UserDatabase } from "~~/server/db/database";

export default defineEventHandler(async (event) => {
  if (event.method !== "GET") {
    return null;
  }

  const db = await UserDatabase.getInstance();
  const passKey = getRouterParam(event, "pass") || "";
  const user = await db.getUserViaPass(passKey);

  if (!user) {
    return null;
  }

  const imageIds = (await db.getImageIds(user.id)).map((obj) => obj.id);
  const comments = await getCommentsForImages(db, imageIds);
  const { ratings, starRatingTotals } = await getStarRatingsForImages(db, imageIds);

  return {
    user,
    starRatingAverages: ratings,
    imageIds,
    starRatingTotals,
    comments,
  };
});

async function getCommentsForImages(db: UserDatabase, imageIds: string[]): Promise<string[][]> {
  return Promise.all(
    imageIds.map(async (imageId) => {
      const commentsData = await db.getCommentsById(imageId);
      return commentsData.map((obj) => obj.comment);
    })
  );
}

async function getStarRatingsForImages(db: UserDatabase, imageIds: string[]): Promise<{ ratings: number[], starRatingTotals: number[] }> {
  const ratings: number[] = [];
  const starRatingTotals: number[] = [];

  await Promise.all(
    imageIds.map(async (imageId) => {
      const stars = await db.getStarsById(imageId);
      starRatingTotals.push(stars.length);
      ratings.push(
        stars.length > 0
          ? stars.reduce((a, b) => a + b.starRating, 0) / stars.length
          : 0
      );
    })
  );

  return { ratings, starRatingTotals };
}
