# RankRizz Documentation

## Project Overview

**RankRizz** is a Nuxt.js-based web application where users can upload their photos and receive honest reviews from others. The platform aims to provide constructive feedback and reviews on user-uploaded images.

## Local Development

```bash
pnpm install
```

```bash
pnpm build
pnpm start
```

## Required env vars

DELETION_TIME: This sets the schedule for the cron job that deletes user photos. The default value '0 0 1 * *' runs the job at midnight on the first day of every month. You can adjust this based on your needs.
DB_FILE: This specifies the path to the SQLite database file. The default path is set to ./server/db/users.db.

## Features

- Photo Upload: Users can upload their photos to the platform.
- Honest Reviews: Users receive feedback and reviews on their uploaded photos from the community.
- User Management: Users can create accounts, manage their profiles, and view their uploaded photos and reviews.
