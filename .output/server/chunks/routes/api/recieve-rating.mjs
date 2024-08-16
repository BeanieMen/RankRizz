import { d as defineEventHandler, U as UserDatabase, g as getRequestHeader, c as readFormData, s as setResponseStatus } from '../../runtime.mjs';
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

const recieveRating = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f;
  const db = await UserDatabase.getInstance();
  const ipAddress = (_a = getRequestHeader(event, "x-forwarded-for")) != null ? _a : "";
  const form = await readFormData(event);
  if (!form) {
    setResponseStatus(event, 400);
    return { error: "Form data is missing" };
  }
  const starRating = Number((_b = form.get("starRating")) == null ? void 0 : _b.toString());
  const comment = (_c = form.get("comment")) == null ? void 0 : _c.toString();
  const imageId = (_d = form.get("imageId")) == null ? void 0 : _d.toString();
  if (!imageId) {
    setResponseStatus(event, 400);
    return { error: "Image ID is missing" };
  }
  const isRated = await db.getRatingLookup(imageId);
  if (!imageId || !comment && isNaN(starRating)) {
    setResponseStatus(event, 400);
    return { error: "Missing or invalid rating/comment" };
  }
  if (comment) {
    if (!(isRated == null ? void 0 : isRated.commented)) {
      await db.addComment(imageId, comment);
      await db.upsertRatingLookup(ipAddress, imageId, true, (_e = isRated == null ? void 0 : isRated.starRated) != null ? _e : false);
    } else {
      setResponseStatus(event, 409);
      return { error: "Duplicate comment" };
    }
  }
  if (!isNaN(starRating)) {
    if (!(isRated == null ? void 0 : isRated.starRated)) {
      await db.createStar(imageId, starRating);
      await db.upsertRatingLookup(ipAddress, imageId, (_f = isRated == null ? void 0 : isRated.commented) != null ? _f : false, true);
    } else {
      setResponseStatus(event, 409);
      return { error: "Duplicate rating" };
    }
  }
  setResponseStatus(event, 200);
  return { message: "Successfully uploaded ratings", error: null };
});

export { recieveRating as default };
//# sourceMappingURL=recieve-rating.mjs.map
