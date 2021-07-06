//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/bookRev", {
  useNewUrlParser: true
});

const read = "Read Reviews of Books.";
const postr = "Post Reviews of Books.";

//db
const postSchema = {
  name: String,
  review: String
};

const Post = mongoose.model("Post", postSchema);

const wishlistSchema = {
  bookName: String
};

const Item = mongoose.model("Item", wishlistSchema);

//Review Post
app.get("/", function(req, res) {
  res.render("home", {
    read: read,
    postr: postr
  });
});

app.get("/read", function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("read", {
      posts: posts
    });
  });
});

app.get("/post", function(req, res) {
  res.render("post");
});

app.get("/read/:postId", function(req, res) {
  const reqPostId = req.params.postId;

  Post.findOne({
    _id: reqPostId
  }, function(err, foundPost) {
    res.render("reviewPost", {
      name: foundPost.name,
      review: foundPost.review
    });
  });

});

app.post("/post", function(req, res) {
  const newPost = new Post({
    name: req.body.titleBody,
    review: req.body.reviewBody
  });
  newPost.save(function(err) {
    if (!err) {
      res.redirect("/read");
    }
  });
});

app.get("/listen", function(req, res) {
  res.render("listen");
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
