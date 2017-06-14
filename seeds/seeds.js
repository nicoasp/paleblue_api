
module.exports = () => {
  // ----------------------------------------
  // Create Users
  // ----------------------------------------
  console.log('Creating Users');
  var users = [];
  for (let i = 0; i < 10; i++) {
    var user = new User({
      email: `foobar${ i }@gmail.com`,
      password: 'password'
    });
    users.push(user);
  }


  // ----------------------------------------
  // Hotels
  // ----------------------------------------
  console.log('Creating Dots');
  var contents = [];

  var content1 = new Content({
    userId: users[1]._id,
    contentType: "image",
    data: "https://i0.wp.com/st.gdefon.ru/wallpapers_original/wallpapers/393789_tigry_art_planeta_zemlya_1680x1050_(www.GdeFon.ru).jpg",
    lng: -71.2760,
    lat: 42.4906
  });
  contents.push(content1);

  var content2 = new Content({
    userId: users[2]._id,
    contentType: "image",
    data: "https://cdn.thinglink.me/api/image/640257704702509057/1240/10/scaletowidth",
    lng: -31.2760,
    lat: 62.4906
  });
  contents.push(content2);

  var content3 = new Content({
    userId: users[3]._id,
    contentType: "text",
    data: "Hello I'm content",
    lng: 14.2760,
    lat: 22.4906
  });
  contents.push(content3);


  // ----------------------------------------
  // Finish
  // ----------------------------------------
  console.log('Saving...');
  var promises = [];
  [
    users,
    contents
  ].forEach((collection) => {
    collection.forEach((model) => {
      promises.push(model.save());
    });
  });
  return Promise.all(promises);
};
