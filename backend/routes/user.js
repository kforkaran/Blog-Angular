const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post("/signup", (req, res) => {
  console.log("signup request");
  bcrypt.hash(req.body.password, 10, )
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json();
        })
        .catch(err => {
          res.status(500).json();
        });
    });
});

router.post("/login", (req, res) => {
  console.log("login request");
  let fetchedUser;
  User.findOne({
      email: req.body.email
    }).then(user => {
      console.log(user);
      fetchedUser = user;
      if (!user) {
        return res.status(401).json();
      }
      bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json();
      }
      const token = jwt.sign({
        email: fetchedUser.email,
        userId: fetchedUser._id
      }, 'longest_secret_i_could_think_of_at_this_moment', {
        expiresIn: '1h'
      });
      res.status(200).json({
        token: token
      });
    })
    .catch(err => {
      res.status(401).json(err);
    });
});

module.exports = router;
