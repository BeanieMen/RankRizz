import { UserDatabase } from "../../db/database";

export default defineEventHandler(async (event) => {
  if (event.method !== "GET") {
    return { user: null, rating: null };
  }

  const dbInstance = UserDatabase.getInstance();
  const passKey = getRouterParam(event, "pass") || "";
  const user = await dbInstance.getUserByPasskey(passKey);

  if (user) {
    const stars = user.stars ? user.stars.split("") : [];
    const total = stars.reduce((sum, star) => sum + Number(star), 0);
    const rating = stars.length > 0 ? total / stars.length : 0;

    return { user: user, rating: rating };
  } else {
    return { user: null, rating: null };
  }
});
