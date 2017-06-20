const models = require("./models");
const User = models.User;
const Content = models.Content;
const Like = models.Like;

// Start the script by asking the user to enter some text content.
// Store this contentId for later use
const demoUserId = "demoUserId";
const demoContentId = "demoContentId";


// All the content and likes can be done by one single fake user, since we don't make any conditions on like ids or locations for user contents.
let user;
User.create({
  email: "foobar@gmail.com",
  password: "password",
  demoId: demoUserId
})
.then(savedUser => {
  user = savedUser;
})


const imageUrls = ["url1", "url2"]
const textMessages = ["text1", "text2"]
const coordinates = [{lng: 1, lat: 1}, {lng: 2, lat: 2}] 

// Create a bunch of content programmatically with those 3 things.
let contentArray = [];

imageUrls.forEach((url) => {
	let { lng, lat} = coordinates[Math.floor(Math.random() * coordinates.length)]
  Content.create({
    userId: user._id,
    contentType: "image",
    data: url,
    lng,
    lat
  })
  .then((savedContent) => {
    content = savedContent;
    done();        
  })
})






const sayHello = () => {
	return setTimeout(() => {
		console.log("Hello");
	}, 3000)
}

// setTimeout(() => {
// 	console.log("Hello");
// }, 3000)

sayHello();