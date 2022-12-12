const fs = require('fs'); //allow interaction with filesystem; we want to delete our file
const path = require('path'); //path used also in django

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//middleware import
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

//making object of express
const app = express();

app.use(bodyParser.json()); //should be on top of the other middlewares

// app.use('/uploads/images', express.static(path.join('uploads', 'images'))); //without this we can't receive request outside the backend jsut like any the get patch, image too need one
//uses express.static becomes the controller 
//requested files in the folder are returned with the join path


//headers that will allow the cnnection else it will not get to this place
//this together with the logic of authsubmit handler to ensure connection to this place
/// and from here to the db
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

//registering middle ware
//since the route is /:pid this means 
// a user will use /api/places/pid to reach
// this api that takes the first part of the URL
// and calls plcesRoutes to handle the rest 
// there it should see /pid to continue the journey
// which then calls the contorller
app.use('/api/places', placesRoutes); 
app.use('/api/users', usersRoutes);

//using our error to catch any error due to not found route

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error; //synchronous else next(error)
});

//then incase we get file from user but the account wasnt crreated due to errors
//we want the file deleted
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => { //delete the file 
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});


//  app.listen(5000);


// ********************************** mongoose db connection and server initialization **********************************************
mongoose
  .connect(
    `mongodb+srv://nyars16:ZWeoQDHvuKlY8r3N@cluster0.ugvobps.mongodb.net/mern3?retryWrites=true&w=majority`
    )
  .then(() => {
    app.listen(5000);
    console.log("CONNECTED my mern")
  })
  .catch(err => {
    console.log(err);
  });

