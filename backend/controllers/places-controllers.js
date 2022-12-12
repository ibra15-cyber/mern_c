const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');


// ******************************************** getplaceby uisng place id* ****************************************
const getPlaceByPlaceId = async (req, res, next) => {
  const placeId = req.params.pid; //find all place ids' in the db pid because we used it in route just like django


  let place;
  try {
    // in a list item .findIndex but this is mongoose
    //in list too a copy of the list is made before the update
    place = await Place.findById(placeId); //just like in django views; return those places with ids equa placeid
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    );
    return next(error); //next for async code; throw for sync request
  }

  if (!place) {
    const error = new HttpError(
      'Could not find place for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};



// ****************************************************get pic by user id **********************************************************
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let places;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places'); //User from the db
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later.',
      500
    );
    return next(error);
  }

  // if (!places || places.length === 0) {
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map(place =>
      place.toObject({ getters: true })
    )
  });
};


// ****************************************************creating item **********************************************************
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, address } = req.body;

  let coordinates;
  try {
    // coordinates = await getCoordsForAddress(fakeaddressthatdoesnothingbcwehardcoddedorlogandlat)
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  //were we structure our data like our model db 
  const createdPlace = new Place({
    title,
    description,
    address,
    location: {    //hardcodding it ; no billing account
            lat: 40.7484474,
            lng: -73.9871516
     } ,
    image: req.file.path, //this controller and its route already handles request to this, so uploading uses the same route
    creator: req.userData.userId //getingthe id form the token generated
  });

  let user;
  try {
    user = await User.findById(req.userData.userId); //id once again from the request
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession(); //create a session
    sess.startTransaction();                    //use session to start a transaction
    await createdPlace.save({ session: sess }); //save createdplace temp with the session
    user.places.push(createdPlace);             //now push the tem created place to db
    await user.save({ session: sess });         //save the us
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }

  //saving to db if verything goes well
  res.status(201).json({ place: createdPlace }); 
};



// ****************************************************updating *********************************************************
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description } = req.body; //only title and description can be updated
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  //if a user didn't create a place, they should not be able to update or delete
  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this place.', 401);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};



// ****************************************************deleting place **********************************************************
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  // in list he used filter to get all items but the current one with id
  // dummy_places.filter(p => p.id !== placeId)

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find place for this id.', 404);
    return next(error);
  }

  //if place createor is not the token we are receiving, don't allow them to delete
  if (place.creator.id !== req.userData.userId) { //no .toString bc id is already a string
    const error = new HttpError(
      'You are not allowed to delete this place.',
      401 //unathorized code
    );
    return next(error);
  }

  const imagePath = place.image; //getting image path

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  //after removing the place info, delete the image too
  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted place.' });
};




exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
