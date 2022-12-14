const User = require('../models/User.model');
const mongoose = require('mongoose');

const router = require('express').Router();

const Exercise = require('../models/Exercise.model');

router.post('/addClient', (req, res, next) => {
  console.log(req.body);
  User.findByIdAndUpdate(req.body.loggedIn, {
    $push: { clients: req.body },
  }).then((resp) => console.log(resp));
});

router.get('/users/:id/clients', (req, res, next) => {
  console.log('call', req.params.id);
  User.findById(req.params.id)
    .then((user) => {
      res.json(user.clients);
    })
    .catch((err) => res.json(err));
});

router.get('/exercises', (req, res, next) => {
  console.log(req.body);
  Exercise.find()
    .then((allTheExercisesFromDB) => {
      const uniqueTargetArray = [
        ...new Set(
          allTheExercisesFromDB.map((exercise) => {
            return exercise.target;
          })
        ),
      ];
      const uniqueEquipmentArray = [
        ...new Set(
          allTheExercisesFromDB.map((exercise) => {
            return exercise.equipment;
          })
        ),
      ];
      res.json({
        workouts: allTheExercisesFromDB,
        targets: uniqueTargetArray,
        machines: uniqueEquipmentArray,
      });
    })
    .catch((error) => {
      console.log('Error while getting the exercises from the DB: ', error);
      next(error);
    });

  router.post('/user/chosenExercises', (req, res, next) => {
    console.log('BODY: ', req.body);
    const exercises = req.body.chosenExercises;
    const exercisesObjectId = exercises.map((exercise) => {
      const XR = mongoose.Types.ObjectId(exercise);
      return XR;
    });
    const filter = { email: req.body.email };
    const update = { chosenExercise: exercisesObjectId };
    User.findOneAndUpdate(filter, update, {
      new: true,
    })
      .populate('chosenExercise')
      .then((response) => {
        res.json(response);
      });
  });
});

module.exports = router;
