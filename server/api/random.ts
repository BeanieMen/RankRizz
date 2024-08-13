import { defineEventHandler, getQuery, setResponseStatus } from "h3";
import { UserDatabase } from "../db/database";

export default defineEventHandler(async (event) => {
  const db = await UserDatabase.getInstance();
  const query = getQuery(event);

  const fetchedUserIdsParam = query.fetchedUserIds || "";
  if (typeof fetchedUserIdsParam != "string") return;
  const fetchedUserIds = fetchedUserIdsParam.split(",").filter((id) => id);
  const fetchedUserIdsSet = new Set(fetchedUserIds);

  const randomData = await db.getRandomImageIds(fetchedUserIdsSet);

  setResponseStatus(event, 200);
  return {
    data: {
      randomUsers: randomData
    },
  };
});
