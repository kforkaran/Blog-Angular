const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb+srv://karan:kZ3n57m0KaDpqJ0q@cluster0-cbk5e.mongodb.net/blog-angular?retryWrites=true&w=majority", {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Connection to database Successful');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
})
app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(
    addedPost => {
      res.status(200).json({
        postId: addedPost._id
      });
    });
});

app.get("/api/posts", (req, res) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts Fetched Succesfully!',
        posts: documents
      });
    });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then();
  res.status(200).json();
});

module.exports = app;
