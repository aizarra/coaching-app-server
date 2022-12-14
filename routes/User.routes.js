const router = require('express').Router();
const User = require('../models/User.model');
const mongoose = require('mongoose');

router.get('/userProfile', (req, res, next) => {
  User.findById(req.session.currentUser._id)
    .then((user) => {
      res.render('components/userProfile', { user });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
