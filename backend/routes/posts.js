const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post("", multer({
  storage: storage
}).single("image"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(
    addedPost => {
      res.status(200).json({
        post: {
          ...addedPost,
          id: addedPost._id
        }
      });
    });
});

router.put("/:id", multer({
  storage: storage
}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({
    _id: req.params.id
  }, post).then(() => res.status(200).json());
});

router.get("", (req, res) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts Fetched Succesfully!',
        posts: documents
      });
    });
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json();
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then();
  res.status(200).json();
});

module.exports = router;
