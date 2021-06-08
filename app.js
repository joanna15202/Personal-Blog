//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const posts = [];

// *********************
// Setup mongoose
// *********************
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb+srv://admin_joanna:test123@cluster0.fgfuw.mongodb.net/blogDB', { // blogDB is your database name
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// *********************
// Mongoose Schema
// *********************
const postSchema = {
  title: String,
  content: String
};

// *********************
// Mongoose Model
// *********************
const Post = mongoose.model('Post', postSchema); // item here needs to be a singular term. Mongoose will convert it to plural term automatically.

// -----------
// Lodash
// -----------
// Load the full build.
var _ = require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// -----------
// Home Route
// -----------
app.get("/", function(req, res) {
  // Find all the posts in the posts collection. In this step, we will see that our compose shows in the posts collection in mongoDB.
  Post.find({}, function(err, foundPosts) { // foundPosts is the document you found here
    res.render("home", {
      startingContent: homeStartingContent,
      posts: foundPosts
    })
  });
})

// -----------
// Posts Route
// -----------
app.get('/posts/:postId', function(req, res) {
  const requestedPostId = req.params.postId;

  // Find the requested post id
  Post.findOne({
    _id: requestedPostId,
  }, function(err, post) {
    if (!err) {
      res.render("post", {
        title: post.title,
        body: post.content
      })
    }
  })

  posts.forEach(function(post) {
    const realTitle = _.lowerCase(post.title);
    if (requestedTitle === realTitle) {
      res.render('post', {
        title: post.title,
        body: post.body
      });
    } else {
      console.log("Not a match");
    }
  })
})

// --------------
// Compose Route
// --------------
app.get("/compose", function(req, res) {
  res.render("compose");
})

app.post("/compose", function(req, res) {
  // Create a new post object
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  // Remember to save it.
  post.save().then(function() {
    res.redirect("/");
  });

})

// -----------
// About Route
// -----------
app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
})

// -----------
// Contact Route
// -----------
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
})

// -----------
// Listen
// -----------
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully.");
});
