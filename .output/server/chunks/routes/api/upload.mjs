import { promises } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { d as defineEventHandler, U as UserDatabase, g as getRequestHeader, c as readFormData, s as setResponseStatus, a as generateRandomString } from '../../runtime.mjs';
import 'node:http';
import 'node:https';
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

const upload = defineEventHandler(async (event) => {
  var _a;
  const db = await UserDatabase.getInstance();
  const ipAddress = (_a = getRequestHeader(event, "x-forwarded-for")) != null ? _a : "";
  const formData = await readFormData(event);
  const userId = formData.get("userId");
  const imageFile = formData.get("image");
  if (!userId || !imageFile) {
    setResponseStatus(event, 400);
    return { error: "User ID and image file are required" };
  }
  const uploadPath = path.join(process.cwd(), "public", "user-photos", userId);
  const uploadedImageId = generateRandomString();
  const filename = `id_${uploadedImageId}.webp`;
  const filePath = path.join(uploadPath, filename);
  try {
    await promises.mkdir(uploadPath, { recursive: true });
  } catch (error) {
    console.error("Error creating directory:", error);
    setResponseStatus(event, 500);
    return { error: "Error creating upload directory" };
  }
  const imageIds = await db.getImageIds(userId);
  if (imageIds.length >= 3) {
    setResponseStatus(event, 403);
    return { error: "Upload limit reached (3 images per user)" };
  }
  try {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const image = sharp(buffer);
    const metadata = await image.metadata();
    if (metadata.width && metadata.height) {
      const { width, height } = metadata;
      if (width < 256 || height < 256 || width > 1920 || height > 1080) {
        setResponseStatus(event, 400);
        return {
          error: "Image dimensions must be between 256x256 and 1920x1080."
        };
      }
      await image.webp({ quality: 50 }).toFile(filePath);
      await db.addImage(userId, uploadedImageId);
      await db.addRatingLookup(ipAddress, uploadedImageId);
      setResponseStatus(event, 200);
      return { message: "File uploaded successfully", error: null };
    } else {
      setResponseStatus(event, 500);
      return { error: "Error retrieving image metadata" };
    }
  } catch (error) {
    console.error("Error processing image:", error);
    setResponseStatus(event, 500);
    return { error: "Error processing image" };
  }
});

export { upload as default };
//# sourceMappingURL=upload.mjs.map
