const models = require("./models");
const User = models.User;
const Content = models.Content;
const Like = models.Like;
const faker = require('Faker');

const imageList = [
  { data: "http://iamdjduckworth.com/wp-content/uploads/2014/10/Image.jpg", lat: 40.785091, lng: -73.968285 },
  { data: "https://harrietinez.files.wordpress.com/2014/10/img_3450.jpg", lat: 40.758896, lng: -73.985130 },
  { data: "https://upload.wikimedia.org/wikipedia/commons/3/36/London_Bus_route_8_Oxford_Street_029.jpg", lat: 51.515419, lng: -0.141099 },
  { data: "https://www.moillusions.com/wp-content/uploads/1.bp.blogspot.com/_cxmptAPYR-s/RcyVEXL4cJI/AAAAAAAAAKQ/kb_1f89G_Fg/s400/2004-03-27+12-55-44+Parigi.JPG", lat: 48.858093, lng: 2.294694 },
  { data: "https://akinyiadongo.files.wordpress.com/2012/06/4-nairobi-nightlife.jpg?w\x3d768", lat: ‎-26.195246, lng: ‎28.034088 },
  { data: "http://www.westchinago.com/wp-content/uploads/2014/05/yt-p0035588.jpg", lat: ‎39.913818, lng: 116.363625 },
  { data: "https://buzzingtojapan.files.wordpress.com/2007/06/imperial-palace-1.jpg", lat: ‎35.685360, lng: 139.753372 },
  { data: "http://www.livethelanguage.cn/wp-content/uploads/2012/11/susanne_homestay11.jpg", lat: 31.267401, lng: 121.522179  },
  { data: "https://farm3.static.flickr.com/2857/33200692204_569a2fe4ff_b.jpg", lat: ‎-12.046374, lng:  ‎-77.042793 },
  { data: "https://cdn.getyourguide.com/niwziy2l9cvz/5xwj1sGdMIgy4OM6kiWs8M/d636edf0399a445aff1bd40131bdba57/peru-machu-picchu-001.jpg", lat: -13.163068, lng: -72.545128 },
  { data: "https://i.ytimg.com/vi/0fy5hnlQaLk/hqdefault.jpg", lat: -22.970722, lng: -43.182365 },
  { data: "https://ak5.picdn.net/shutterstock/videos/16297231/thumb/1.jpg", lat: ‎55.754093, lng: 37.620407  },
  { data: "https://rebekahfunktravelwriting.files.wordpress.com/2014/02/dsc_6887.jpg", lat: ‎-4.036878, lng: ‎39.669571 },
]



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
      })
      .then((savedLike) => {
        let finalLike = {
          _id: savedLike._id,
          contentId: thisContent._id,
          fromUserId: savedLike.fromUserId,
          fromLng: savedLike.fromLng,
          fromLat: savedLike.fromLat,
          toLng: thisContent.lng,
          toLat: thisContent.lat,
          demoId: savedLike.demoId,
          createdAt: savedLike.createdAt
        }
        sentLikes.push(savedLike);
        socket.emit("new like", finalLike);    
      })
    }    
  }, delay)
}

let mainUser, mainContent, otherUser;
let postedContent = [];
let sentLikes = [];
let timeouts = [];
let demoStopped = false;



const cleanDb = () => {
  mainUser.remove();
  mainContent.remove();
  otherUser.remove();
  postedContent.forEach((c) => {
    c.remove();
  });
  sentLikes.forEach((l) => {
    l.remove();
  });  
}

const stopScript = () => {
  timeouts.forEach((timeout) => {
    clearTimeout(timeout);
  })
  cleanDb();
  demoStopped = true;
}


const mainScript = (socket, demoUserId, demoContentId) => {

  socket.on('end demo', () => {
    console.log("demo ended manually");    
    stopScript();    
    socket.emit("finish demo");
  })

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
      let delay = Math.floor(Math.random() * 120 + 1) * 1000;
      timeouts.push(createAndSendContent(socket, demoUserId, otherUser._id, delay, postedContent));
    }  
    for (let i = 0; i < 20; i++) {
      let delay = Math.floor(Math.random() * 100 + 21) * 1000;
      timeouts.push(createAndSendLike(socket, demoUserId, otherUser._Id, delay, postedContent, sentLikes));
    }
  })


  // After 2 minutes, delete all created entities
  setTimeout(() => {
    if (!demoStopped) {
      cleanDb();
      socket.emit("finish demo");      
    }
  }, 125000)
}

module.exports = mainScript;




