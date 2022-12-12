const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password'); //exclude the password when getting users
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};




const signup = async (req, res, next) => {
  // the other side of express validator fn check used in the routers to enforce some fields
  const errors = validationResult(req); 
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password } = req.body;

  //if user finding users gives error, throw error
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  //if communication works adn user exist bhrough th email throw error
  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  // else hassh the password 
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12); //12 salting rounds ie making the password strong
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  // and go on and create the user 
  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: []
  });

  //try and save the usuer in the db, in case of comm error throw err
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  //go ahead and create the user id but incase it still fails due to server or comm throw that error
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email }, //making a token at sign in using id and email
      'supersecret_dont_share',
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token }); //we are adding token to what we will send back to the front end to be saved in the local host
};




const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  //TRY TO FIND IF USER EXIST USIGN THEIR EMAIL. connection error throw the catch
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  //if the user wasnt found uisng his email try him hes not invalid user
  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403 //changed to 401
    );
    return next(error);
  }

  //compare the password we got from the post request with the email's password we found in the db in case of connection errors
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  // if it connects then we check if the password is correct whihc will make isvlaidpass true
  //if password does validity is false ie the compare false
  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  // of everything is fine  login the user unlsess connection error
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      'supersecret_dont_share',
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id, //return the token, id and email from the db
    email: existingUser.email,
    token: token
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
