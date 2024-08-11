# Nuxt Server API Documentation

## Routes

### `GET /user/[pass]`
Fetches user information based on the provided pass.

**Response:**
- `user` (User) : User details.
- `imageLocations` (string[]) : List of images uploaded by the user.
- `rating` (string) : Average rating given to the user.
- `starReviewCount` (string) : Total number of stars given to the user.
- `comments` (string[]) : The comments given to the user.

**Example Request and Response:**
```http
GET /user/somepass
{
  "user": {
    "id": 1,
    "username": "exampleUser",
    "passKey" : "examplePass"
  },
  "imageLocations": [
    "/images/user1/photo1.png",
    "/images/user1/photo2.png"
  ],
  "rating": 4.5,
  "starReviewCount": 20,
  "comments": [
  "unmatched rizz",
  "absolute L"
  ]
}
```


### `POST /generate-account`
Creates a new user account based on the provided username.

**Request Body:**
- `username` (string): The desired username for the new account.

**Response:**
- `passKey` (string): The generated pass key for the new account.
- `username` (string): The username that was attempted to be created.
- `error` (string|null): An error message if the request failed, or `null` if successful.

**Example Request:**
```http
POST /generate-account
Content-Type: application/json

{
  "username": "newUser"
}
```
**Example Response**
```http
{
  "passKey": "generatedPassKey123",
  "username": "newUser",
  "error": null
}
```


### `GET /random`

Fetches a random username and all associated image locations.

**Respone:**
- `username` (string) : The random username.
- `imageLocations` (string[]) : List of images associated with the username.
- `userId` (string) : The random user id.

**Example Request and Response:**
```http
GET /random
{
  "username": "randomUser",
  "imageLocations": [
    "/images/randomUser/photo1.png",
    "/images/randomUser/photo2.png"
  ],
  "userId": "randomId"
}

```


### `POST /upload`

Uploads an image for a specified user and updates the database.

The body will be in the form of formdata

**Request Body:**

- `userId` (string) : The ID of the user.
- `image` (Buffer) : The image file to be uploaded.


**Example Response:**
```http
{
    "message": "File uploaded successfully"
}
```

### `POST /recieve-rating`

Uploads the rating given by a user and updates the database.

The body will be in the form of formdata

**Request Body:**

- `userId` (string) : The ID of the user.
- `starRating` (string): The recieved comment.
- `comment` (string) : The recieved star rating.

**Example Response:**
```http
{
    "message":  "Successfully uploaded ratings" 
}
```
