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
    const { starRatingAverages, starRatingTotals } = await getStarRatingsForImages(
      db,
      imageIds
    );

    setResponseStatus(event, 200);
    return {
      error: null,
      data: {
        user,
        starRatingAverages: starRatingAverages,
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
): Promise<{ starRatingAverages: number[]; starRatingTotals: number[] }> {
  const starRatingTotals: number[] = [];
  const starRatingAverages: number[] = [];

  await Promise.all(
    imageIds.map(async (imageId) => {
      starRatingTotals.push(await db.getTotalStarsCount(imageId));
      starRatingAverages.push(await db.getAverageStarRating(imageId));
    })
  );

  return { starRatingAverages, starRatingTotals };
}
