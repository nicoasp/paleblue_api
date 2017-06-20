const models = require("./models");
const User = models.User;
const Content = models.Content;
const Like = models.Like;
const faker = require('Faker');


// All the content and likes can be done by one single fake user, since we don't make any conditions on like ids or locations for user contents.


const createAndSendContent = (socket, demoUserId, otherUserId, delay, postedContent) => {
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
      userId: otherUserId,
      contentType,
      data,
      lng: faker.Address.longitude(),
      lat: faker.Address.latitude(),
      demoId: demoUserId
    })
    .then((savedContent) => {
      postedContent.push(savedContent);
      socket.emit("new content", savedContent);           
    })    
	}, delay)
}

const createAndSendLike = (socket, demoUserId, otherUserId, delay, postedContent, sentLikes) => {
  return setTimeout(() => {
    if (postedContent.length) {
      let thisContent = postedContent[Math.floor(Math.random() * postedContent.length)];
      Like.create({
        fromUserId: otherUserId,
        contentId: thisContent._id,
        fromLng: faker.Address.longitude(),
        fromLat: faker.Address.latitude(),
        demoId: demoUserId,
        toLng: thisContent.lng,
        toLat: thisContent.lat
      })
      .then((savedLike) => {
        console.log(savedLike);
        sentLikes.push(savedLike);
        socket.emit("new like", savedLike);    
      })
    }    
  }, delay)
}


const mainScript = (socket, demoUserId, demoContentId) => {

  let mainUser, mainContent, otherUser;
  let postedContent = [];
  let sentLikes = [];

  // Give the already created user it's own demoId
  User.findById(demoUserId)
  .then(demoUser => {
    if (demoUser) {
      demoUser.demoId = demoUserId;
      demoUser.save((err, updatedUser) => {
        if (err) { console.log(err); }
        mainUser = demoUser;
      })        
    }
    return;
  }) 
  // Give the content he created the demoId
  .then(() => {
    return Content.findById(demoContentId)
  })  
  .then(demoContent => {
    if (demoContent) {
      demoContent.demoId = demoUserId;
      demoContent.save((err, updatedContent) => {
        if (err) { console.log(err); }
        mainContent = demoContent;
      })        
    }
    return;
  }) 
  // Create a fake user to do all the content and likes
  .then(() => {
    return User.create({
      email: `${Date.now()}@gmail.com`,
      password: "password",
      demoId: demoUserId
    })
  })
  .then(savedUser => {
    otherUser = savedUser;
    return;
  })
  // Create 30 random content pieces and 20 likes for that existing content
  .then(() => {
    for (let i = 0; i < 30; i++) {
      let delay = Math.floor(Math.random() * 300 + 1) * 1000;
      createAndSendContent(socket, demoUserId, otherUser._id, delay, postedContent);
    }  
    for (let i = 0; i < 20; i++) {
      let delay = Math.floor(Math.random() * 300 + 20) * 1000;
      createAndSendLike(socket, demoUserId, otherUser._Id, delay, postedContent, sentLikes);
    }
  })


  // After 5 minutes, delete all created entities
  setTimeout(() => {
    mainUser.remove();
    mainContent.remove();
    otherUser.remove();
    postedContent.forEach((c) => {
      c.remove();
    })
    sentLikes.forEach((l) => {
      l.remove();
    })
  }, 301000)
}

module.exports = mainScript;




