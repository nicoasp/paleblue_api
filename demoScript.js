const models = require("./models");
const User = models.User;
const Content = models.Content;
const Like = models.Like;
const faker = require('faker');


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



const createAndSendContent = (socket, demoUserId, delay, postedContent) => {
	return setTimeout(() => {
    let contentType, data;
    if (Math.floor(Math.random() * 2)) {
      contentType = "image";
      data = faker.Image.imageUrl();
    } else {
      contentType = "text";
      data = faker.Lorem.paragraph();
    }
    Content.create({
      userId: user._id,
      contentType,
      data,
      lng: faker.Address.longitude(),
      lat: faker.Address.latitude(),
      demoId: demoUserId
    })
    .then((savedContent) => {
      postedContent.push(content);
      socket.emit("new content", content);           
    })    
	}, delay)
}

const sendLike = (socket, demoUserId, delay, postedContent) => {
  return setTimeout(() => {
    if (postedContent.length) {
      let { fromLng, fromLat} = coordinates[Math.floor(Math.random() * coordinates.length)]
      Like.create({
        fromUserId: user._id,
        contentId: postedContent[Math.floor(Math.random() * postedContent.length)]
        fromLng,
        fromLat,
        demoId: demoUserId
      })
      .then((savedLike) => {
        socket.emit("new like", savedLike);    
      })
    }    
  }, delay)
}


const mainScript = (socket, demoUserId, demoContentId, text) => {

  // Give the already created user it's own demoId
  User.findById(demoUserId)
  .then(demoUser => {
    if (demoUser) {
      demoUser.demoId = demoUserId;
      demoUser.save((err, updatedUser) => {
        if (err) { console.log(err); }
      })        
    }
  }) 
  // Give the content he created the demoId
  Content.findById(demoContentId)
  .then(demoContent => {
    if (demoContent) {
      demoContent.demoId = demoUserId;
      demoContent.save((err, updatedContent) => {
        if (err) { console.log(err); }
      })        
    }
  }) 

  let postedContent = [];
  // For each created piece of content, publish it at a random time
  while (contentArray.length) {
    let content = contentArray.pop();
    let delay = Math.floor(Math.random() * 300 + 1) * 1000;
    sendContent(socket, content, delay, postedContent);
  }
  for (let i = 0; i < 20; i++) {

  }
}





