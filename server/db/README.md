# Nuxt Server API Documentation

## Routes

### `GET /user/[pass]`
Fetches user information based on the provided pass.

**Response:**
- `user`: User details.
- `imageLocations`: List of images uploaded by the user.
- `rating`: Average rating given to the user.
- `starReviewCount`: Total number of stars given to the user.

**Example Request and Response:**
```http
GET /user/somepass
{
  "user": {
    "id": 1,
    "username": "exampleUser"
  },
  "imageLocations": [
    "/images/user1/photo1.png",
    "/images/user1/photo2.png"
  ],
  "rating": 4.5,
  "starReviewCount": 20
}
```


### `POST /generate-account`
Creates a new user account based on the provided username.

**Request Body:**
- `username` (string): The desired username for the new account.

**Response:**
- `passKey` (string|null): The generated pass key for the new account, or `null` if an error occurred.
- `username` (string|null): The username that was attempted to be created, or `null` if an error occurred.
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

- `username`: The random username.
- `imageLocations`: List of images associated with the username.

**Example Request and Response:**
```http
GET /random
{
  "username": "randomUser",
  "imageLocations": [
    "/images/randomUser/photo1.png",
    "/images/randomUser/photo2.png"
  ]
}

```


### `POST /upload`

Uploads an image for a specified user and updates the database.

The body will be in the form of formdata

**Request Body:**

- `userId`: The ID of the user.
- `image`: The image file to be uploaded.


**Example Response:**
```http
{
    message: 'File uploaded successfully' 
}
```