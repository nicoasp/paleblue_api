
module.exports = () => {
  // ----------------------------------------
  // Create Users
  // ----------------------------------------
  console.log('Creating Users');
  var users = [];
  for (let i = 0; i < 10; i++) {
    var user = new User({
      email: `foobar${ i }@gmail.com`,
      password: 'password',
      lastActive: new Date(Date.now() - 1000000)
    });
    users.push(user);
  }


  // ----------------------------------------
  // Content
  // ----------------------------------------
  console.log('Creating Dots');
  var contents = [];

  contents.push(
    new Content({
      userId: users[1]._id,
      contentType: "image",
      data: "https://i0.wp.com/st.gdefon.ru/wallpapers_original/wallpapers/393789_tigry_art_planeta_zemlya_1680x1050_(www.GdeFon.ru).jpg",
      lng: -84.3880,
      lat: 33.7490
    }),
    new Content({
      userId: users[2]._id,
      contentType: "image",
      data: "https://cdn.thinglink.me/api/image/640257704702509057/1240/10/scaletowidth",
      lng: -31.2760,
      lat: 62.4906
    }),
    new Content({
      userId: users[3]._id,
      contentType: "text",
      data: "Hello I'm content",
      lng: 14.2760,
      lat: 22.4906
    }),
    new Content({
      userId: users[3]._id,
      contentType: "text",
      data: "Hello I'm content",
      lng: -70.9410,
      lat: 42.2181
    }),
    new Content({
      userId: users[3]._id,
      contentType: "text",
      data: "Hello I'm from Seattle",
      lng: -122.3321,
      lat: 47.6062
    }),
    new Content({
      userId: users[3]._id,
      contentType: "text",
      data: "Maggie was here",
      lng: -73.7331,
      lat: 40.7613
    })
  );

  // ----------------------------------------
  // Like
  // ----------------------------------------
  console.log('Creating Likes');
  var likes = [];

  likes.push(
    new Like({
      fromUserId: users[1]._id,
      contentId: contents[3]._id,
      fromLng: -84.3880,
      fromLat: 33.7490
    }),
    new Like({
      fromUserId: users[2]._id,
      contentId: contents[3]._id,
      fromLng: -31.2760,
      fromLat: 62.4906
    }),
    new Like({
      fromUserId: users[5]._id,
      contentId: contents[3]._id,
      fromLng: 14.2760,
      fromLat: 22.4906
    })
  );


  // ----------------------------------------
  // Finish
  // ----------------------------------------
  console.log('Saving...');
  var promises = [];
  [
    users,
    contents,
    likes
  ].forEach((collection) => {
    collection.forEach((model) => {
      promises.push(model.save());
    });
  });
  return Promise.all(promises);
};
