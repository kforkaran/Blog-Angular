const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postsRoutes = require('./routes/posts');

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
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
})

app.use("/api/posts", postsRoutes);

module.exports = app;
