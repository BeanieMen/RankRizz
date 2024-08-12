import { UserDatabase } from "~~/server/db/database";
import { setResponseStatus } from "h3";

export default defineEventHandler(async (event) => {
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
    const { ratings, starRatingTotals } = await getStarRatingsForImages(
      db,
      imageIds
    );

    setResponseStatus(event, 200);
    return {
      error: null,
      data: {
        user,
        starRatingAverages: ratings,
        imageIds,
        starRatingTotals,
        comments,
      },
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    setResponseStatus(event, 500);
    return { error: "Error fetching user data" };
  }
});

async function getCommentsForImages(
  db: UserDatabase,
  imageIds: string[]
): Promise<string[][]> {
  return Promise.all(
    imageIds.map(async (imageId) => {
      const commentsData = await db.getCommentsById(imageId);
      return commentsData.map((obj) => obj.comment);
    })
  );
}

async function getStarRatingsForImages(
  db: UserDatabase,
  imageIds: string[]
): Promise<{ ratings: number[]; starRatingTotals: number[] }> {
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
