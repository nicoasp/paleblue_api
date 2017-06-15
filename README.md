# paleblue_api
Express API for Paleblue

You will need to create a .env file for the JWT_SECRET

Run tests with jasmine from the root directory



Likes workflow:

MONGO

Like Entity:
	- _id
	- fromUserId
	- fromLng
	- fromLat
	- contentId
	- createdAt

User Entity:
	- add lastActive

ROUTE

- Search likes (populate content > populate userId) where userId = currentUser and user.lastActive < createdAt

REDUX

Likes: [
	{ fromUserId, fromLng, fromLat, createdAt},
]

Animation flow:

- If receiving user online, triggered by websockets
- Upon login or new visit, trigger animation for all likes since lastActive