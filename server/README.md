# Nuxt Server API Documentation

## Routes

### `GET /user/[pass]`
Fetches user information based on the provided pass.

**Response:**
- `user` (User): User details.
- `imageIds` (string[]): List of images uploaded by the user in the form of their IDs.
- `starRatingAverages` (number[]): Average rating given to each photo of the user.
- `starRatingTotals` (number[]): Total number of stars given to each photo of the user.
- `comments` (string[][]): The comments given to each photo of the user.

**Example Request and Response:**

```http
GET /user/somepass
{
  "user": {
    "id": 1,
    "username": "exampleUser",
    "passKey": "examplePass"
  },
  "imageIds": [
    "exampleId1",
    "exampleId2"
  ],
  "starRatingAverages": [2, 3],
  "starRatingTotals": [20, 2],
  "comments": [
    ["unmatched rizz"],
    ["absolute L"]
  ]
}
```

### POST `/generate-account`
Creates a new user account based on the provided username.

**Request Body:**
- `username` (string): The desired username for the new account.

**Response:**
- `passKey` (string): The generated pass key for the new account.
- `username` (string): The username that was attempted to be created.
- `error` (string|null): An error message if the request failed, or null if successful.

**Example Request:**
```http
POST /generate-account
Content-Type: application/json

{
  "username": "newUser"
}
```

**Example Response:**
```http
{
  "passKey": "generatedPassKey123",
  "username": "newUser",
  "error": null
}
```

### `GET /random`
Fetches 5 random users and their associated image locations, excluding users specified in the query parameter.

**Query Parameters:*
- `fetchedUserIds` (string[]): Comma-separated list of user IDs to be excluded from the random selection.

**Response:**
- `data` (object):
    - `randomUsers` (array): List of random users with their associated details.
        - `username` (string): The unique random username.
        - `imageIds` (string[]): List of image IDs associated with the username.
        - `userId` (string): The unique random user ID.

**Example Request:**
```http
GET /random?fetchedUserIds=exampleId1,exampleId2
```
**Example Response:**
```http
{
  "data": {
    "randomUsers": [
      {
        "username": "randomUser1",
        "imageIds": ["imageId1a", "imageId1b"],
        "userId": "userId1"
      },
      {
        "username": "randomUser2",
        "imageIds": ["imageId2a", "imageId2b"],
        "userId": "userId2"
      },
      {
        "username": "randomUser3",
        "imageIds": ["imageId3a", "imageId3b"],
        "userId": "userId3"
      }
    ]
  }
}
```

### `POST /upload`
Uploads an image for a specified user and updates the database.

The body will be in the form of formdata.

**Request Body:**
- `userId` (string): The ID of the user.
- `image` (Buffer): The image file to be uploaded.

**Example Response:**
```http
{
  "message": "File uploaded successfully"
}
```

### `POST /receive-rating`
Submits a rating and/or comment for an image.

**Request Body:**
- `starRating` (number, optional): The rating for the image (0.5-10).
- `comment` (string, optional): The comment for the image.
- `imageId` (string): The ID of the image being rated.

**Response:**
- `message` (string): Confirmation message of the successful operation.
- `error` (string | null): Error message if something went wrong.

**Example Request:**
```http
POST /receive-rating
Content-Type: multipart/form-data
{
  "starRating": 5,
  "comment": "Great photo!",
  "imageId": "exampleImageId"
}
```
**Example Response:**
```http
{
  "message": "Successfully uploaded ratings",
  "error": null
}
```

### `Database and API Relations`
**For a visual representation of the relationships between the database and API routes, refer to the UML diagram below:**
<br/>
<br/>
![backend](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/BeanieMen/RankRizz/master/server/model.iuml)