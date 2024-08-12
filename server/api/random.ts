import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import { UserDatabase } from '../db/database';

export default defineEventHandler(async (event) => {
  const db = await UserDatabase.getInstance();
  const body = await readBody(event);

  const fetchedUserIds: string[] = body.fetchedUserIds || [];
  const fetchedUserIdsSet = new Set(fetchedUserIds);

  const randomData = await db.getRandomImageIds(fetchedUserIdsSet);
  
  setResponseStatus(event, 200);
  return {
    imageIds: randomData?.imageIds,
    username: randomData?.username,
    userId: randomData?.userId
  };
});
